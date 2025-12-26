import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { Hash, TrendingUp, ShieldAlert, Copy, Check } from 'lucide-react';
import { generateHashtags } from '../services/geminiService';
import { HashtagGroup } from '../types';
import * as d3 from 'd3';

// --- D3 Network Graph Component ---
const HashtagNetwork: React.FC<{ hashtags: HashtagGroup[] }> = ({ hashtags }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || hashtags.length === 0) return;

    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Prepare nodes and links
    const nodes: any[] = [{ id: "Topic", group: 0, radius: 30 }];
    const links: any[] = [];

    hashtags.forEach((group, gIdx) => {
      // Group Node
      const groupId = `Group-${gIdx}`;
      nodes.push({ id: group.name, group: gIdx + 1, radius: 20 });
      links.push({ source: "Topic", target: group.name });

      // Tag Nodes
      group.tags.slice(0, 5).forEach(tag => { // Limit to 5 for visual clarity
        nodes.push({ id: tag, group: gIdx + 1, radius: 10 });
        links.push({ source: group.name, target: tag });
      });
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 5));

    const link = svg.append("g")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => d.group === 0 ? "#4f46e5" : d.group === 1 ? "#10b981" : d.group === 2 ? "#f59e0b" : "#6366f1");

    const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.id.startsWith('#') ? d.id : d.id.substring(0, 10))
      .attr("font-size", (d: any) => d.radius / 2)
      .attr("fill", "#1e293b")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      text
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

  }, [hashtags]);

  return (
    <div className="w-full overflow-hidden bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="400" viewBox="0 0 600 400" className="max-w-full" />
    </div>
  );
};


export const HashtagAssistant = () => {
  const [keyword, setKeyword] = useState('');
  const [groups, setGroups] = useState<HashtagGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!keyword) return;
    setLoading(true);
    const results = await generateHashtags(keyword);
    setGroups(results);
    setLoading(false);
  };

  const copyTags = (tags: string[], idx: number) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedGroup(idx);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Hash className="text-emerald-500" /> Hashtag Assistant
        </h1>
        <div className="flex gap-4">
          <Input 
            placeholder="Enter topic (e.g., 'Fitness for busy moms')" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="text-lg"
          />
          <Button size="lg" onClick={handleGenerate} isLoading={loading} disabled={!keyword}>
            Analyze & Generate
          </Button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
             {groups.map((group, idx) => (
               <Card key={idx} className="p-6">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <h3 className="font-bold text-slate-800 text-lg">{group.name}</h3>
                     <Badge variant={group.competition === 'High' ? 'warning' : group.competition === 'Low' ? 'success' : 'neutral'}>
                       {group.competition} Comp.
                     </Badge>
                   </div>
                   <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyTags(group.tags, idx)}
                   >
                     {copiedGroup === idx ? <Check size={14} className="mr-1"/> : <Copy size={14} className="mr-1"/>}
                     {copiedGroup === idx ? 'Copied' : 'Copy All'}
                   </Button>
                 </div>
                 <div className="flex flex-wrap gap-2 mb-4">
                   {group.tags.map((tag, tIdx) => (
                     <span key={tIdx} className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md hover:text-indigo-600 cursor-pointer transition-colors">
                       {tag}
                     </span>
                   ))}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                    <TrendingUp size={14} /> Relevance Score: {(group.relevance * 10).toFixed(1)}/10
                 </div>
               </Card>
             ))}
           </div>
           
           <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-slate-800 mb-4">Hashtag Relationship Graph</h3>
                <HashtagNetwork hashtags={groups} />
                <p className="text-xs text-slate-400 mt-2 text-center">Visualizing semantic relationships between generated clusters.</p>
              </Card>

              <Card className="p-4 bg-rose-50 border-rose-100 flex gap-3">
                 <ShieldAlert className="text-rose-500 shrink-0" />
                 <div>
                   <h4 className="font-bold text-rose-800 text-sm">Banned Hashtag Safety Check</h4>
                   <p className="text-rose-600 text-xs mt-1">
                     All generated hashtags are checked against the known banned list to protect your reach.
                   </p>
                 </div>
              </Card>
           </div>
        </div>
      )}

      {groups.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
           <Hash className="mx-auto text-slate-300 mb-4" size={48} />
           <p className="text-slate-500">Enter a keyword to discover high-performing tag clusters.</p>
        </div>
      )}
    </div>
  );
};
