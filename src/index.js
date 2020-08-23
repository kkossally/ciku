import './styles/index.scss';
import * as d3 from 'd3';
// import hanzi from 'hanzi';

document.addEventListener('DOMContentLoaded', () => {

  // TESTING //
  window.d3 = d3; 
  // TESTING //

  const radicals = ['人', '口', '土', '女', '心', '手'];

  const nodes = [];
  const links = [];

  let mouse = null;

  const linkGap = 40;

  const [svgWidth, svgHeight] = [980, 500];

  const svg = d3.select('svg')
      .attr('viewBox', [-svgWidth / 2, -svgHeight / 2, svgWidth, svgHeight])
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave)
      .on('click', handleClick)
      ;

  const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-400))
      .force('link', d3.forceLink(links))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', handleTick);

  let nodeGroup = svg.append('g')
      .attr('fill', '#5F9EA0')
    .selectAll('circle');


  let linkGroup = svg.append('g')
      .attr('stroke', '#317873')
    .selectAll('line');

  function updateNodes() {
    nodeGroup = nodeGroup
      .data(nodes)
      .join(
        enter => enter.append('circle').attr('r', 0)
          .call(enter => enter.transition().attr('r', 40))
      );
  }

  function updateLinks() {
    linkGroup = linkGroup
      .data(links)
      .join('line');
  }

  function inRange({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }) {
    return Math.hypot(sourceX - targetX, sourceY - targetY) <= linkGap;
  }

  function spawn(source) {
    nodes.push(source);

    for (const target of nodes) {
      if (inRange(source, target)) {
        links.push({source, target});
      }
    }

    updateLinks();
    updateNodes();
  }

  function handleTick() {
    nodeGroup
        .attr('cx', d => d.x ? d.x : 0)
        .attr('cy', d => d.y ? d.y : 0)
        .text(d => d.text);

    linkGroup
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y1', d => d.target.y);
  }

  function handleMousemove() {
    const [x, y] = d3.mouse(this);
    mouse = {x, y};
    simulation.alpha(1).restart();
  }

  function handleMouseleave() {
    mouse = null;
  }

  function handleClick() {
    handleMousemove.call(this);
    spawn({ x: mouse.x, y: mouse.y, text: radicals[Math.floor(Math.random()) * radicals.length] });
    simulation.nodes(nodes);
    simulation.force('link').links(links);
    simulation.alpha(1).restart();
  }

  spawn({x: 0, y: 0, text: '好'});
});



