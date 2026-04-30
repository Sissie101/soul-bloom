import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, Bot, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || 'Function';
  const status = toolCall?.status || 'pending';
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try { return typeof results === 'string' ? JSON.parse(results) : results; }
    catch { return results; }
  })();

  const isError = results && (
    typeof results === 'string' && /error|failed/i.test(results) ||
    parsedResults?.success === false
  );

  const statusConfig = {
    pending: { icon: Clock, color: 'text-white/40', text: 'Pending' },
    running: { icon: Loader2, color: 'text-violet-300', text: 'Running...', spin: true },
    in_progress: { icon: Loader2, color: 'text-violet-300', text: 'Running...', spin: true },
    completed: isError
      ? { icon: AlertCircle, color: 'text-rose-400', text: 'Failed' }
      : { icon: CheckCircle2, color: 'text-emerald-400', text: 'Done' },
    success: { icon: CheckCircle2, color: 'text-emerald-400', text: 'Done' },
    failed: { icon: AlertCircle, color: 'text-rose-400', text: 'Failed' },
    error: { icon: AlertCircle, color: 'text-rose-400', text: 'Failed' }
  }[status] || { icon: Zap, color: 'text-white/40', text: '' };

  const Icon = statusConfig.icon;
  const formattedName = name.split('.').reverse().join(' ').toLowerCase();

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200",
          expanded
            ? "bg-white/10 border-white/20"
            : "bg-white/5 border-white/10 hover:bg-white/8"
        )}
      >
        <Icon className={cn("h-3 w-3 shrink-0", statusConfig.color, statusConfig.spin && "animate-spin")} />
        <span className="text-white/70 font-medium">{formattedName}</span>
        {statusConfig.text && (
          <span className={cn("text-white/40", isError && "text-rose-400")}>· {statusConfig.text}</span>
        )}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight className={cn("h-3 w-3 text-white/30 transition-transform ml-auto", expanded && "rotate-90")} />
        )}
      </button>

      {expanded && !statusConfig.spin && (
        <div className="mt-1.5 ml-3 pl-3 border-l border-white/10 space-y-2">
          {toolCall.arguments_string && (
            <div>
              <div className="text-white/30 mb-1">Parameters</div>
              <pre className="bg-black/30 rounded-lg p-2 text-white/60 whitespace-pre-wrap text-[11px] overflow-x-auto">
                {(() => {
                  try { return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2); }
                  catch { return toolCall.arguments_string; }
                })()}
              </pre>
            </div>
          )}
          {parsedResults && (
            <div>
              <div className="text-white/30 mb-1">Result</div>
              <pre className="bg-black/30 rounded-lg p-2 text-white/60 whitespace-pre-wrap text-[11px] max-h-48 overflow-auto">
                {typeof parsedResults === 'object' ? JSON.stringify(parsedResults, null, 2) : parsedResults}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex gap-3 my-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md shadow-violet-900/40">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div className={cn("max-w-[76%] min-w-0", isUser && "flex flex-col items-end")}>
        <div className={cn(
          "px-4 py-3 text-sm leading-relaxed rounded-2xl",
          isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-br-sm shadow-lg shadow-violet-900/40"
            : "bg-white/8 text-white/90 rounded-bl-sm border border-white/10 backdrop-blur-sm"
        )}>
          {message.content && (
            <ReactMarkdown
              className={cn(
                "prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                isUser ? "prose-invert" : "prose-invert"
              )}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = typeof className === 'string' ? className.match(/language-(\w+)/) : null;
                  const textContent = String(children).replace(/\n$/, '');
                  if (!inline && match) {
                    return (
                      <div className="relative group/code my-2">
                        <pre className="bg-black/50 text-slate-200 rounded-xl p-3 overflow-x-auto border border-white/10">
                          <code {...props} className={className}>{children}</code>
                        </pre>
                        <Button
                          size="icon" variant="ghost"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 bg-white/10 hover:bg-white/20"
                          onClick={() => { navigator.clipboard.writeText(textContent); toast.success('Copied'); }}
                        >
                          <Copy className="h-3 w-3 text-white/70" />
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <code {...props} className="px-1 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-xs">
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="my-1 leading-relaxed text-white/90">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc text-white/80">{children}</ul>,
                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal text-white/80">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                h1: ({ children }) => <h1 className="text-base font-bold my-2 text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold my-2 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold my-1.5 text-white/90">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-violet-400/50 pl-3 my-2 text-white/60 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {message.tool_calls?.length > 0 && (
          <div className="space-y-1 mt-1 w-full">
            {message.tool_calls.map((tc, idx) => (
              <FunctionDisplay key={idx} toolCall={tc} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shrink-0 mt-1 shadow-md border border-white/10">
          <User className="w-3.5 h-3.5 text-white/80" />
        </div>
      )}
    </div>
  );
}