var black = 'rgba(60,60,60,0.5)'
var tooltip = d3.select("body")
  .append("div")
  .attr('class','tooltip')
  .style("position", "fixed")
  .style("z-index", "10")
  .style("visibility", "hidden");

var tooltipTitle = tooltip.append('h2');
var tooltipPosition = tooltip.append('h3');

var margins = {top:40,bottom:40,left:40};
var w = parseFloat(d3.select('.timeline').style('width'));

var svg,timeline,monthScale,h;

var today = new Date();
var currentYear = today.getFullYear();
var currentMonth = today.getMonth();
var currentDay = today.getDate()/30;
var timestart = {year: currentYear - 5, month: currentMonth};
var timeend = {year:(currentMonth == 11)?currentYear+1:currentYear, month:(currentMonth == 11)?0:currentMonth+1};
var timeStartMonth = timestart.year*12+timestart.month;
var timeEndMonth = timeend.year*12+timeend.month;

var legendSvg = d3.select('.timeline').append('svg')
  .attr('height',margins.top).attr('width',w);

var sketchyCircles = legendSvg.selectAll('.colName').data(['education','work','other']).enter().append('g')
  .attr('class','colName')
  .attr('transform',function(d,i){
    var xC = (1.5*margins.left)+((i+1)*25);
    return 'translate('+xC+','+(margins.top/2)+')';
  })

sketchyCircles.each(function(d){
  var sketch = d3.sketchy.circle();
  var fill = (d == 'education')?'dodgerblue':(d =='work')?'magenta':'lime';
  sketch
    .radius(10)
    .fill(fill)
    .stroke("black")
    .strokeWidth(7);
  d3.select(this).call(sketch);
})
.on('mouseover', dotHover)
.on('mousemove', dotHover)
.on('mouseout', barOut)
.on('touchstart', dotHover)
.on('touchmove', dotHover)
.on('touchend', barOut);;

d3.json('../assets/experience.json', function(error,data){
  var includes = data.items.filter(function(a){return a.include == 'y'});
  var skills = data.technical;
  buildResume(includes,skills);
  buildTimeline(includes);
});

function plusMinus(x){
  return (Math.random()*x)*((Math.random()>0.5)?1:(-1));
}

function buildResume(things,skills){
  var categories = ['Work','Education','Other'];
  things.sort(function(b,a){
    return (a.end[0]*12+a.end[1]) - (b.end[0]*12+b.end[1])
  });
  for (var i=0;i<categories.length;i++){
    var catClass = (categories[i]=='Work')?'.work-items':(categories[i]=='Education')?'.edu-items':'.other-items';
    var items = d3.select(catClass).selectAll('.item'+categories[i])
       .data(things.filter(function(a){return a.type == categories[i]})).enter()
       .append('div').attr('class','item other');
    var itemHead = items.append('h3').html(function(d){
      return d.title + " - "+d.position;
    });
    var itemDateLoc = items.append('h4').html(function(d){
      return d.date + "<br>" + d.location;
    });
    var itemDesc = items.append('p').html(function(d){
      return d.description;
    });
  }
  d3.select(".skill-items").append("ul")
    .selectAll('li').data(skills).enter().append('li').text(function(d){return d});
}

function dotHover(d){
  var currOffset = window.pageYOffset;
  var innerH = window.innerHeight;
  var clientY = d3.event.clientY;

  tooltip.style("visibility", "visible")
    .style("top", ((clientY<innerH/2)?(d3.event.clientY+currOffset)+"px":null))
    .style("bottom", ((clientY<innerH/2)?null:(innerH-d3.event.clientY-currOffset)+"px"))
    .style("left",function(){
      var offset = d3.event.clientX+10;
      return offset+'px';
    })
  tooltipTitle.html(d);
  tooltipPosition.html('');
}

function barHover(d){
  var currOffset = window.pageYOffset;
  var innerH = window.innerHeight;
  var clientY = d3.event.clientY;

  tooltip.style("visibility", "visible")
    .style("top",function(){
        var offset = (clientY<innerH/2)?(d3.event.clientY)+"px":null;
        return offset;
    })
    .style("bottom",function(){
      var offset = (clientY<innerH/2)?null:(innerH-d3.event.clientY)+"px";
      return offset;
    })
    .style("left",function(){
      var offset = d3.event.clientX+10;
      return offset+'px';
    })
  tooltipTitle.html(d.title);
  tooltipPosition.html(d.position);
}

function barOut(d){
  tooltip.style('visibility','hidden');
}

function buildTimeline(timelinePts){
h = parseFloat(d3.select('.resume').style('height'));

svg = d3.select('.timeline').append('svg')
  .attr('height',(h-(margins.bottom/2))).attr('width',w);

var timeline = svg.append('line')
  .attr('x1', 0).attr('y1',0)
  .attr('x2',0).attr('y2', h)
  .attr('transform', 'translate('+margins.left+',0)')
  .style('stroke', black).style('stroke-width',2);

monthScale = d3.scale.linear().domain([timeStartMonth,timeEndMonth]).range([h-margins.bottom,margins.top]);

timelinePts.sort(function(a,b){
  return (a.start[0]*12+a.start[1]) - (b.start[0]*12+b.start[1])
});

/*var todayLine = svg.append('path').style('stroke',black).style('stroke-width',1.2).style('fill','none')
.attr('d',function(){
  var y0 = monthScale(currentYear*12+currentMonth+currentDay);
  var y1 = y0 - (margins.top*0.2);
  var y2 = y0 - (margins.top*0.8);
  var x0 = margins.left;
  var x1 = (0.5)*margins.left;
  return 'M '+x0+' '+y0+' L '+x1+' '+y1;
});

var todayText = svg.append('text').text('today').style('fill',black)
  .style('font-size','1.4rem').style('text-anchor','middle')
  .attr('transform',function(){
    var x = (0.4)*margins.left;
    var y = monthScale(currentYear*12+currentMonth+currentDay)-(margins.top*0.25);
    return 'translate('+x+','+y+')rotate(-90)';
});*/

var sketchyBars = svg.selectAll('g.bar').data(timelinePts).enter().append('g').attr('class','bar');
sketchyBars.each(function(d,i){
  var sketch = d3.sketchy.rect();

  var endMonth = d.end[0]*12+d.end[1];
  var startMonth = d.start[0]*12+d.start[1];
  var height = monthScale(startMonth)-monthScale(endMonth);

  var x = (d.type == 'Education')?1:(d.type =='Work')?2:3;
  var dbls = [/*'School for Field Studies',*/'Chatham Shellfish','Duke University Marine Lab'];
  if (dbls.indexOf(d.title)!== -1){x+= 0.5};
  var xC = (1.5*margins.left)+(x*20);
  var yC = monthScale(endMonth);
  var color = (d.type == 'Education')?'dodgerblue':(d.type =='Work')?'magenta':'lime';

  sketch
    .height(height)
    .width(18)
    .x(xC)
    .y(yC)
    .stroke("white")
    .strokeWidth(5)
    .fill(color)
    .jostle(3)
  d3.select(this).call(sketch);
})
.on('mouseover', barHover)
.on('mousemove', barHover)
.on('mouseout', barOut);

var yearRange = d3.range(timestart.year,timeend.year+1);
var monthRange = d3.range(timeStartMonth,timeEndMonth+1);
var yearMarks = svg.selectAll('.yrMark').data(yearRange).enter().append('text')
  .attr('class', 'yrMark')
  .text(function(d){return d})
  .attr('transform', function(d){
    var endMonth = d*12;
    var thisDist = monthScale(endMonth);
    var angle = (-90)+plusMinus(3);
    return 'translate('+(margins.left-20)+','+(thisDist+10)+')rotate('+angle+')';
  })
  .attr('text-anchor','start');

var ticks = svg.selectAll('.ticks').data(monthRange).enter().append('g').attr('class','ticks')
  .attr('transform', function(d){
    var x = margins.left - 10;
    var y = monthScale(d);
    return 'translate('+x+','+y+')';
  });

var tickLines = ticks.append('line').attr('class','tick')
  .attr('x1', function(d){
    return (d%12==0)?0:5;
  })
  .attr('x2',function(d){
    return (d%12==0)?20:15;
  })
  .attr('y1',plusMinus(1))
  .attr('y2',plusMinus(1))
  .style('stroke', black).style('stroke-width',2);

var tickLabels = ticks.each(function(d){
  var monthLabels = ['jan','apr','jul','oct'];
  var monthIndex = [0,3,6,9];
  var month = monthIndex.indexOf(d%12);
  if (month !== -1){
    d3.select(this).append('text').attr('class','tickL')
      .text(monthLabels[month])
      .style('fill',black)
      .attr('transform',function(){
        var x = (month == 0)?22:17;
        var angle = plusMinus(3);
        return 'translate('+x+',5)rotate('+angle+')';
      })
    .style('font-size','1.6rem');
  }
});

function resize(){
  h = parseFloat(d3.select('.resume').style('height'));
  svg.attr('height',(h-margins.bottom/2));
  timeline.attr('y2',h);

  monthScale.range([h-margins.bottom,margins.top]);

sketchyBars.each(function(d,i){
  d3.select(this).selectAll("*").remove();
  var sketch = d3.sketchy.rect();

  var endMonth = d.end[0]*12+d.end[1];
  var startMonth = d.start[0]*12+d.start[1];
  var height = monthScale(startMonth)-monthScale(endMonth);

  var x = (d.type == 'Education')?1:(d.type =='Work')?2:3;
  var dbls = ['Chatham Shellfish','Duke University Marine Lab'];
  if (dbls.indexOf(d.title)!== -1){x+= 0.5};
  var xC = (1.5*margins.left)+(x*20);
  var yC = monthScale(endMonth);
  var color = (d.type == 'Education')?'dodgerblue':(d.type =='Work')?'magenta':'lime';

  sketch
    .height(height)
    .width(18)
    .x(xC)
    .y(yC)
    .stroke("white")
    .strokeWidth(5)
    .fill(color)
    .jostle(3)
  d3.select(this).call(sketch);
})

yearMarks
  .attr('transform', function(d){
    var endMonth = d*12;
    var thisDist = monthScale(endMonth);
    var angle = (-90)+plusMinus(3);
    return 'translate('+(margins.left-20)+','+(thisDist+10)+')rotate('+angle+')';
  })

  ticks
  .attr('transform', function(d){
    var x = margins.left - 10;
    var y = monthScale(d);
    return 'translate('+x+','+y+')';
  });

  /*todayLine.attr('d',function(){
    var y0 = monthScale(currentYear*12+currentMonth+currentDay);
    var y1 = y0 - (margins.top*0.2);
    var y2 = y0 - (margins.top*0.8);
    var x0 = margins.left;
    var x1 = (0.5)*margins.left;
    return 'M '+x0+' '+y0+' L '+x1+' '+y1;
  });
  todayText.attr('transform',function(){
      var x = (0.4)*margins.left;
      var y = monthScale(currentYear*12+currentMonth+currentDay)-(margins.top*0.8);
      return 'translate('+x+','+y+')rotate(-90)';
  });*/

// holeResize();

}

window.onresize = resize;

}
