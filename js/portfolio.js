var borderC = 'rgba(60,60,60,0.8)';
var strokeW = 21;
var jos = 7;

d3.json('../assets/portfolio.json', function(error,data){
  var included = data.items.filter(function(a){return a.include == 'y'});
  buildPortfolio(included);
});

function buildPortfolio(items){

  items.sort(function(a,b){return (b.date[1]==a.date[1])?b.date[0]-a.date[0]:b.date[1]-a.date[1]});
  var containers = d3.select('.container').selectAll('.pair').data(items)
    .enter().insert('div','.footer').attr('class','row pair');

  var outerDiv = containers.append('div').attr('class','ten columns item').attr('opened','no');

  var upperText = outerDiv.append('h2')
    .html(function(d){
      return d.title;
    });
  var picLink = outerDiv.append('div').attr('class','innerPic')
    .style('background-image', function(d){return 'url("../assets/portfolio_images/'+d.image+'")';});

  picLink.append('svg').attr('height',(100+jos)).append('g').attr('class','sketchBorder');

  var innerDesc = picLink.append('div').attr('class','innerDesc');
  var innerText = innerDesc.append('div').attr('class','innerText')
    .html(function(d){
      return d.shortDesc+'<br><br>';
    });

  var links = picLink.append('div').attr('class','links')
  .html(function(d){
    var links = '<br><a href="'+d.url+'" target="_blank">View Project</a>';
    if (d.code !== ''){
      links += '<a href="'+d.code+'" target="_blank">View Code</a>'
    }
    return links;
  });

  outerDiv.append('p').attr('class','date')
    .text(function(d){
      return d.date[2];
    });
  outerDiv.append('p')
    .text(function(d){
      var tags = d.tags;
      return tags.join(" . ")
    });

  var sketchRects = d3.selectAll('.sketchBorder').each(function(){
    getSketchy(this,100);
  })
  d3.selectAll('.item').on('click', function(d){
    d3.select('.item.opened').each(unhoverItem).attr('class','ten columns item');
    d3.select(this).each(hoverItem).attr('class','ten columns item opened');
  })
}

window.onresize = function(){
  d3.selectAll('.item').each(unhoverItem);
  d3.select('.item.opened').each(hoverItem);
  // holeResize();
}

function getSketchy(that,h){
  var sketch = d3.sketchy.rect();
  var w = parseFloat(d3.select('.item').style('width'));
  sketch
    .height(h)
    .width(w)
    .x(0)
    .y(0)
    .stroke(borderC)
    .strokeWidth(strokeW)
    .fill('none')
    .jostle(jos)
  d3.select(that).call(sketch);
}

function hoverItem(d){
  var h = parseFloat(d3.select(this).select('.innerDesc').style('height'));
  d3.select(this).select('.innerPic').transition().duration(700).style('height',h+'px');
  d3.select(this).select('svg').attr('height',(h+jos)+'px');
  d3.select(this).select('.links').style('display','block').transition().duration(700).style('opacity',1);
  d3.select(this).select('.sketchBorder').transition().duration(50).style('opacity',0)
    .each("end",function(){
      d3.select(this).selectAll("*").remove();
      getSketchy(this,h);
      d3.select(this).transition().delay(500).duration(500).style('opacity',1)
    });
  d3.select(this).select('.innerDesc').transition().duration(700).style('opacity',1);
}

function unhoverItem(d){
  d3.select(this).select('.innerPic').transition().duration(700).style('height','100px');
  d3.select(this).select('svg').attr('height',(100+jos)+'px');
  d3.select(this).select('.links').style('display','none').transition().duration(700).style('opacity',0);
  d3.select(this).select('.sketchBorder').transition().duration(50).style('opacity',0)
    .each("end",function(){
      d3.select(this).selectAll("*").remove();
      getSketchy(this,100);
      d3.select(this).transition().delay(500).duration(500).style('opacity',1);
    })
  d3.select(this).select('.innerDesc').transition().duration(700).style('opacity',0);
}
