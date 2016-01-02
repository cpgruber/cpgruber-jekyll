  	d3.select('.name').selectAll('span').on('mouseover', change).on('mouseout', unchange);
  	d3.selectAll('.subname').selectAll('span').on('mouseover', change).on('mouseout', unchange);
    d3.select('#socmedia').selectAll('img').on('mouseover', change).on('mouseout', unchange);

  	function change(){
  		d3.select(this).transition().duration(200).style('margin-top','-5px').style('margin-bottom','5px');
  	}
  	function unchange(){
  		d3.select(this).transition().duration(400).style('margin-top','0px').style('margin-bottom','0px');
  	}
