# Social Distancing Occupancy Counter

Occupancy is a free-to-use, multi-endpoint counter to keep track of how many people you have in your store, restaurant, spaceship, etc…

No matter how many entries/exits you have

## Wait, it’s a What?

As quarantine restrictions are starting to loosen up around the world, health officials are emphasizing the need to keep [social distancing practices](https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/social-distancing.html) in place.

One of the things that can help is limiting the number of people you allow into your space as it helps keep the needed minimal distance requirements in place to keep everyone safe.

We saw the need for a simple solution that could help everyone, and with our skillset, we wanted to help.

So we created an easy to use, multi-client counter. Start up a space and start keeping tally of people as they come and go. Receive instant feedback on whether you’re at the maximum occupancy you’ve set for your space.

We don’t collect any sensitive data or store anything long term. This app is free to use, and we’re going to keep it that way.


## Technologies used

We set this up to be as simple as possible. Because this is a side project we didn't want to get too crazy with frameworks. If you would like to fork the repo and build it in a framework feel free!

We built this using html and javascript with hosting through [Clouflare workers](https://workers.cloudflare.com/)

The room data is stored using AWS and that is on another repo. 

## Running locally

First install git and npm

Next run `npm install`, then `npm start`

For long term testing please consider changing the aws url to one of your own.

### Thanks for the interest!
