    var holeSvg = d3.select('body').append('svg').attr('class','holes').attr('width','24px');
    var defs = holeSvg.append('defs').append('linearGradient').attr('id','grad1')
      .attr('x1','0').attr('x2','100%').attr('y1','0').attr('y2','0')
    defs.append('stop').attr('offset','0').style('stop-color','powderblue').style('stop-opacity',1);
    defs.append('stop').attr('offset','15%').style('stop-color','lightblue').style('stop-opacity',1);
    defs.append('stop').attr('offset','70%').style('stop-color','powderblue').style('stop-opacity',1);

    function holeResize(){
      holeSvg.selectAll('circle').remove();
      var contH = d3.select('.container').style('height');
      var topBuff = 150;
      var spacing = 350;
      holeSvg.attr('height',contH);
      var numDots = Math.ceil((parseInt(contH)-topBuff)/spacing);
      var range = d3.range(numDots);

      holeSvg.selectAll('.hole').data(range).enter().append('circle').attr('r',12)
      .style('stroke','none').style('fill','url(#grad1)')
        .attr('transform', function(d){
          var x = 12;
          var y = topBuff + (d*spacing);
          return 'translate('+x+','+y+')';
        })
    }

    $(document).on('ready',holeResize);
