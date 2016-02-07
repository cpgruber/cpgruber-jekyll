---
layout: post
title:  "Responsive D3 charts made easy"
date:   2016-02-04
description: Charts fit for any web page. Can it be?
tags: first blog
css: /css/blog.css
---

I've been playing with D3 for a little over six months now, and I have yet to get bored with it. You can visualize virtually any dataset imaginable and in any way imaginable, ranging from simple bar charts to force directed layouts to things I've [never conceived before](http://listen.hatnote.com/). Suffice it to say, I love D3. However, as I've started making more visualizations for public view, I am more attune to the fact that visualizations need to be responsive to a website's flexible layout. An SVG with a width of 700 might work fine on a full-screen view, but throwing that fixed 700-pixel-wide graph into the page's mobile layout often won't yield the desired result. Fortunately, making a chart responsive is not such a tall task-- follow along with me below.

#### Step 1 - Make a object-oriented D3 chart
![making a d3 chart is like drawing an owl](http://lh5.ggpht.com/tM5qqA-3dBqOzpkx4q39Ltqu9Zj2pT9Uml4J7FI2-1leq5puUvJKlYZKew2jeBcxid6kmS0vyM693gvXkcTIzvJPyyM "making a d3 chart is like drawing an owl")

Now, I realize that's a pretty involved first step. It's almost like me showing you how to draw this owl.

1. Declare an empty object.
2. Write the rest of the fucking code.

But I've got you covered. 


<!--{% highlight js %}
{% endhighlight %}-->

<iframe src="http://cpgruber.github.io/responsive-d3-demo/step1.html" ></iframe>

#### Step 2 - Set dimensions based on the SVG's parent container
aksdkhakshdasd

<iframe src="http://cpgruber.github.io/responsive-d3-demo/step2.html" ></iframe>

#### Step 3 - Listen for window resize events, set dimensions based on rendered values
jlhalksdlkahsd

<iframe src="http://cpgruber.github.io/responsive-d3-demo/step3.html" ></iframe>

#### Step 4 - Resize SVG and chart elements with new dimensions
kjaksdjkjasdkja

<iframe src="http://cpgruber.github.io/responsive-d3-demo/step4.html" ></iframe>

In closing...
