'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Network, Sparkles, Layers, Info, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        const data = await api.getKnowledgeGraph();
        setGraphData(data);
        if (data.nodes?.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (err) {
        console.error("Failed to load knowledge graph data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-700/10 border border-indigo-500/20 text-burgundy-700 dark:text-burgundy-300 text-xs font-semibold mb-3">
          <Network className="w-3.5 h-3.5" />
          <span>Ontological Relationship Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Visual Knowledge Graph
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Interactive graph mapping multi-directional relationships across Species, Sensing Technologies, Clinical Applications, Primary Literature, and Candidate Research Gaps.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : graphData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Interactive Graph Node Explorer Panel */}
          <div className="lg:col-span-2 p-6 rounded-3xl academic-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Entities ({graphData.total_nodes}) • Relations ({graphData.total_links})
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sand-1000"></span> Species</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Tech</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Application</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Literature</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Gap</span>
              </div>
            </div>

            {/* Interactive Node Matrix Grid */}
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Click any ontological node below to inspect connected relationships and underlying empirical evidence:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto p-1">
                {graphData.nodes?.map((node: any) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                      selectedNode?.id === node.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md scale-[1.02]'
                        : 'bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: node.color }}
                      ></span>
                      <span className={`text-[10px] font-mono ${selectedNode?.id === node.id ? 'opacity-80' : 'text-slate-400'}`}>
                        {node.type}
                      </span>
                    </div>
                    <span className="text-xs font-bold truncate block">
                      {node.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Selected Node Inspector Sidebar */}
          <div className="p-6 rounded-3xl academic-card space-y-6 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    ></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {selectedNode.type} Node
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedNode.full_title || selectedNode.name}
                  </h3>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Category: <strong className="text-slate-800 dark:text-slate-200">{selectedNode.category}</strong>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedNode.description}
                </div>

                {/* Connected Relationships in Graph */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                    Associated Knowledge Graph Links
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {graphData.links
                      ?.filter((l: any) => l.source === selectedNode.id || l.target === selectedNode.id)
                      .slice(0, 5)
                      .map((link: any, idx: number) => {
                        const otherId = link.source === selectedNode.id ? link.target : link.source;
                        const otherNode = graphData.nodes?.find((n: any) => n.id === otherId);
                        return (
                          <div
                            key={idx}
                            onClick={() => otherNode && setSelectedNode(otherNode)}
                            className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-forest-700/10 border border-slate-200 dark:border-slate-700 cursor-pointer transition flex items-center justify-between"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate mr-2">
                              {link.label}: {otherNode?.name || otherId}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {otherNode?.type}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Select any node from the graph to inspect entity details.
              </div>
            )}

            {selectedNode?.id?.startsWith('doc_') && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openDrawerWithDocId(parseInt(selectedNode.id.replace('doc_', '')))}
                  className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Inspect Primary Document Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      ) : null}

    </div>
  );
}
