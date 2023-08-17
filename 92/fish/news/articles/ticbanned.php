<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Student run information new and other asorted media." />
  <title>Moss News</title>
  <link rel="shortcut icon" href="/icon.png" type="image/png">
  <script src="/news/markdown-it.min.js"></script>
  <script src="/cloak.js"></script>
  <style>
    .content {
      width: 90%;
    }

    a {
      all: unset;
    }

    a:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  </style>
</head>

<body>

  <div class="content">
     
# Why the U.S. Government has banned TikTok
### by FoxMoss Sat 11 Mar 2023

## They did what now?

Okay, okay, the title of this article is fairly <a
href="javascript:openInNewTab(window.location.origin + '/main/')">misleading</a>, but hear me out. This could in
the very near future effect you. The U.S. government mandates that all federal employees delete and refrain from using TikTok on all
government-issued phones. This means anyone who works for the government and has a phone from the government cannot
use TikTok on their phone from the government. This does not mean that they can't use it outside of work nor are
they prohibited from having an account. This probably wont affect you, I don't believe many of the people <a
href="/main/?noblank" target="_blank">viewing</a> this article work for the
government.

## Okay, but like why?

Though this does raise an interesting question. Why couldn't the government just ask for modified versions of TikTok
from ByteDance (the people who make TikTok)? Well ByteDance is a Chinese company and xenophobia aside (xenophobia -
A fear of strangers or foreigners.) the U.S. has good reason to have privacy concerns from TikTok. All social media
today record every action we take. How long we look at each video or image. Did you check the comments? Did you
rewatch the video? All of this data is normally for two goals: keeping you on the app longer, and, more relevant to
this situation, to give advertisers more control on who the show their ads to. Advertisers like fine control of who
they're targeting their ads at so they can more easily get people who would be likely to buy in to what every
they're selling. The more control the advertiser has the better, this encourages platforms to track more information
about a user. This information isn't just for advertisers though as a Chinese company the Chinese government could
easily ask you for say everything they have on the U.S. government and ByteDance would have to comply because of the
laws in China.

## What this means for you

For a while talks of banning TikTok has been in the air because of its privacy concerns. Nothing has happened yet
that would effect the general public. No matter what your going to be fine. If TikTok gets banned that's just going
to leave a giant gap in the market and someone else will replace it.

Social media's already know who you are better than you do (unless you use mastodon), the difference with TikTok is
that the U.S. government doesn't control it.
  </div>

  <script>
    var md = window.markdownit()

    md.configure({
      options: {
        html: true,
        linkify: true,
        typographer: true,
      },
    });
    var result = md.render(document.querySelector(".content").innerHTML);
    document.querySelector(".content").innerHTML = result
  </script>
</body>

</html>
