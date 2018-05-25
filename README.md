# Node Security

## Objectives

By the end of class
* Students will be able to list and describe the 5 most common vulnerabilities in Node.js applications.
* Students will know basic methods to avoid directory traversal, regular expression denial of service, and cross-site scripting vulnerabilities.
* Students will understand the need for HTTPS over HTTP.
* Students will use Snyk to check for package vulnerabilities.

## Pre-Class Instructions

Prior to class, complete the following:
* Ensure students have the repo cloned to their local machine.
* Read through the presentation notes on the slideshow.
* Test out each activity

## Introduction (5 min)
(Open the slideshow and introduce the major concepts that will be covered today.)

## XSS and Injection

### Instructor Do: Cross-Site Scripting
(Start the embargo app. The login page will appear)

Let's start by talking about the most pervasive of vulnerabilities: User inputs that are not controlled in anyway. 

(navigate to `localhost:3000/register` and register a new user. You we be redirected to the transfer page.)

Notice that on the right, there's a list of other Embargo clients in the transfer area. We can choose any client to send money to. 

(Choose a customer and transfer $10)

This works great when used as expected, but let's put on our hacker hats and try to steal something.

(Refresh the app and go back to the registration page)

What if I enter a script tag.

(In `fullname` enter `<script>alert("hey")</alert>`. In another browser, navigate to localhost:3000 and login using `mary` and `444`)

Notice that the hackers script is executing as soon as we log in as any user. This is called **Cross-Site Scripting**. In this case, the attack was pretty benign. What scripts could I write that would be less benign?

(Field a couple answers from the class)

Imagine that I had added a script to get the users session information. I could then interact with the site as though I was that user and transfer myself all of their money . I could potentially grab their account number, address, and any other sensitive information that is displayed. I could even write a post request and send myself their money. 

In fact, that's your first hacker mission! Time to play the villian and steal some dough! Don't worry you don't need to understand how the whole application works to complete this exercise. That's the beauty of being a hacker - you don't need to know the inner workings to exploit their vulnerabilities.

### Student Do: Cross-Site Scripting

(Have students navigate to the class repo on their local machine and run `git fetch mission1` then `git checkout mission1`)


Start the server using `node server`

In the project navigate to `public > js > account.js`

Study the transfer function. This is the post request that transfers money. Take a couple minutes to parse through this with yur neighbor. Make sure you understand how it works and what input it expects. **HINT:** Check out the `completeTransaction` function.

In the browser navigate to `localhost:3000/register` and register a new user. 

In the full name field insert your own post request inside `<script></script>` tags and transfer $100 to the user named `hacker`.

*Since our malicious script will run within the application itself the server will have no idea that it's unsafe! Muhahaha!*

In another browser, navigate to localhost:3000 and sign in using the username `tasha` and password `444`.

If their balance is $900, the you have succeeded. 

**Challenge**: Is this old hat? Want some bonus points? Set up another server and use the registration page to add a malicious script that sends every users information to the other server via a post request.

### Instructor Do: Review

Remember any text that we input in the full name field will render, or in our case run, every time any user logs in. This may not seem realistic, but this is exactly what happens when you run a search on Facebook or hundreds of other sites.

(In VS Code, navigate to `public > js > account.js`. Point out the `transfer` function.)

Notice that the transfer function expects an object with a `name` and `amount` property defined. The intention is for this to be passed to it from the `completeTransaction` function, but there's nothing stoping us from calling it in our malicious script.

(Restart the Embargo app and navigate to the registration page `localhost:3000/register`. Add `<script>transfer({name:"hacker", amount: 100})</script>` in the fullname field and fill out the other fields with any data)

Now every time any user logs in, we will siphon $100 from their account. 

In the interest of covering as much material as possible, we won't be going over the challenge, but you can get the solution for it by fetching the branch `mission1.challenge`.

### Instructor Do: Validation and Sanitization

In addition to cross-site scripting, injection is another big risk with unchecked user input. Injection is writing code that accesses database information, rather than running on other user's machines.

There are two ways to protect against cross-site scripting and injection - validation and sanitization. Both are equally important.

Validation means checking that the input matches your expectations in terms of type, format, and length. For example, a zip code should be 5 digits. If you limit the zip code input field to 5 digits, it's nearly impossible to write malicious code in it. 

Sanitization is the practice of scrubbing out unsafe characters, for example `<script>` tags or other HTML or database specific characters. 

You can add custom validation and sanitization, but when dealing with issues of security, it's best to go with a trusted library. We'll be using the node-validator and express-validator packages. 

### Student Do:

* Challenge: Google and also guard against SQL injections

### Instructor Do: Review

## Regex Denial of Service

### Instructor Do: RegEx

Before we can learn about Regular Expression, or regex, Denial of Service attacks, we need to understand some basic regex.    

(Open [https://jex.im/regulex](https://jex.im/regulex))

Regular Expressions define a pattern against we can match a string. This is commonly used to validate user inputs. There's some weird looking characters here is you haven't seen regular expressions before,but don't worry there's only a few we need to know. 

(Delete the data in the regex visualizer and input `(a-z)`)

This means that the string matches if it is a single character between a and z, inclusive. 

(Add a `+` to the input `(a-z)+`)

The plus sign means that we can have one or more characters between a and z. For example "cow" would now be an acceptable input. Similarly, we could have used an asterisk to mean *zero* or more.

(Alter the input to look like `(a-z)+|(0-9)+`. Ask the students what might match now?)

The pipe symbol means "or". We can now have one or more letters OR one or more numbers. "potato" would match as would "123" but not "123potato".

(Alter the input again `((a-z)+|(0-9)+)+`)

Check out the visualizer. What's acceptable input now? Any combination of letters or numbers. Let's add a few more characters and make this a simple email address validator.

(Make the input `^([a-z]+|[0-9]+)+@.+`)

The caret means "start with", so we have to start with any combination of letters and numbers followed by the `@` symbol followed by any characters one or more times -  dot means any character.

(In the terminal run `time node -e '/^([a-z]+|[0-9]+)+@.+/.test("hhhhhhhhhhhhhhhhhhhhhhhhhhhh")'`. That's 28 h's. Keep increasing by 1. Watch the time grow exponentially. Stop around 20 or 40 seconds.)

Don't worry, you don't have to understand regular expressions. You just need to know how to defend against this attack. Notice how as the input size increases, the time grows exponentially. With a sufficiently long input, the server could be tied up for hours. 

This exponential growth is a product of how regular expressions work. The inner workings aren't important, but essentially it tries to match the string in as many different ways as possible before it gives up and this particular regular expression has A LOT of ways that it can be matched. 

This exact type of attack was used to take down Stack Overflow for 45 minutes not terribly long ago. 

So now it's your turn to take down Embargo Bank! 

### Student Do: RegEx

(Have students navigate to the class repo on their local machine and run `git fetch mission2` then `git checkout mission2`)

Spend a couple minutes playing with the Embargo input fields and trying to tie up the server. 

Look under the hood in the server.js file and check out the Regular Expression that is being used.

### Instructor Do: RegEx DOS Protection

There are two primary ways to protect against RegEx DOS attacks. The first is to limit input size. The shorter the input, the more quickly it can be checked. 

The second is to avoid competing pluses and asterisks - that is a plus inside a set of parenthesis and one outside of them as well.

Put on your hero capes, time to play the good guy and patch this vulnerability!


### Student Do: RegEx DOS Protection

(Have students navigate to the class repo on their local machine and run `git fetch patch2` then `git checkout patch2`)

Write a function in `server.js` that checks the input size and limits it to a reasonable length *before* using the RegEx match. Only run the RegEx match *if* the string is short enough.

**Challenge**: Ready to dive into regular expressions? Try to find a new safe regular expression to check the input instead.

### Instructor Do: Review

---

## Break

---

## Clickjacking

### Instructor Do: Clickjacking

Clickjacking occurs when a user thinks they are clicking one button, but they are actually clicking another.The hacker will iframe one site over another. 

(`git checkout mission3.solution` and open `othersite > sample.html` in the browser.)

Here we have a simple free image service.

(*Single click* the search button with the volume on).

I've been clickjacked! 

(Open Chrome dev tools and change the opacity of the iframe to `0.5`)

While it looked like I was clicking on the search button, I was actually clicking on this video. This YouTube video has been iframed in and hidden from site, so the users don't know which page they are interacting with. In this case, it was kind of funny, but what if this was our banks transfer site and we happened to be logged in to our bank in that browser??

Let's find out. It's time to go back to the dark side and steal more money!

### Student Do: Clickjacking

(Have students navigate to the class repo on their local machine and run `git fetch mission3` then `git checkout mission3`)

Start up the Embargo app using `node server`

In VS Code, navigate to `othersite` and open `mission3.html` in your browser. Note that this is a plain html file, no server needed. 

Add an iframe to the html file with the attribute `src="http://localhost:3000/transfer?name=hacker&amount=100"`

Use a style attribute to set the position to absolute and the opacity to 0.5.

Add top, left, width, and height attributes to position the transfer button directly over the search button.

When your iframe is positioned correctly, lower the opacity to 0.

Nothing will happen if you click search. You aren't a logged in user at the bank, but if you distributed this widely enough, someone is bound to be logged in! 

Navigate to `localhost:3000` and log in using `mary` and `444`.

Now navigate back to `mission3.html` and click search. Search didn't work!?! What would most users do?... Click again, of course! 

Give it a few clicks and refresh Mary's account page. If all went according to plan she should be a few hundred poorer and we are a few hundred richer!! Muahahahah!

### Instructor Do: Review

### Instructor Do: Clickjacking Protection

### Student Do: Clickjacking Protection

---

## Break

---

## Directory Traversals

### Instructor Do: 

* Demo traversal


## The Package Problem

### Instructor Do: 

* Typosquatting
    * crossenv story
* Vulnerabilities in packages
    * Demo Snyk

### Student Do: 

* Use Snyk to look for vulnerabilities in packages on Embargo. 
* replace/fix, something else?
* Challenge

### Instructor Do: Review

## Recap
