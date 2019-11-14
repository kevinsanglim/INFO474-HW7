const margin = {top: 50, right: 50, bottom: 50, left: 50}
, width = 1000 - margin.left - margin.right // Use the window's width 
, height = 1000 - margin.top - margin.bottom // Use the window's height

// load data
d3.json("neighborhoods.json").then(t=>{
    // make an svg and append it to body
    svg=svg = d3.select('body').append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    var e=d3.geoAlbers()
        .scale(250000)
        .rotate([71.049,0])
        .center([.125,42.225])
        .translate([width,height]);
        
    svg.append("g").selectAll("path")
        .data(t.features)
        .enter()
        .append("path")
        .attr("fill","lightgray")
        .attr("d",d3.geoPath()
        .projection(e));

    d3.json("points.json").then(p=>{
        svg.append("g").selectAll("circle")
            .data(p.features)
            .enter()
            .append("path")
            .attr("class","coord")
            .attr("fill","red")
            .attr("d",d3.geoPath()
            .projection(e));
        var xyX1y1 = [];

        Math.getDistance = function( x1, y1, x2, y2 ) {
	
            var 	xs = x2 - x1,
                ys = y2 - y1;		
            
            xs *= xs;
            ys *= ys;
             
            return Math.sqrt( xs + ys );
        };

        for(let i=0;i<p.features.length-1;i++){
            xyX1y1.push({
                x: e(p.features[i].geometry.coordinates)[0],
                y: e(p.features[i].geometry.coordinates)[1],
                x1: e(p.features[i + 1].geometry.coordinates)[0],
                y1: e(p.features[i + 1].geometry.coordinates)[1]
            })
            
            setTimeout(function() { 
                var dist = Math.getDistance(xyX1y1[i].x,xyX1y1[i].y,xyX1y1[i].x1,xyX1y1[i].y1)
                var line = svg.append("g")
                    .append("line")
                    .attr("x1",xyX1y1[i].x)
                    .attr("y1",xyX1y1[i].y)
                    .attr("x2",xyX1y1[i].x1)
                    .attr("y2",xyX1y1[i].y1)
                    .attr("stroke","red")
                    .attr("stroke-dasharray", dist + " " + dist)
                    .attr("stroke-dashoffset", dist)
                    .transition()
                    .duration(500)
                    .attr("stroke-dashoffset", 0);
            }, 100 * i); 


        }

    })
});

