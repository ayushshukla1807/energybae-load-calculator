"use client";

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const providers = [
  { id: 'msedcl', name: 'MSEDCL', region: 'Maharashtra State' },
  { id: 'adani', name: 'Adani Electricity', region: 'Mumbai / Suburban' },
  { id: 'tata', name: 'Tata Power', region: 'Mumbai / Nationwide' },
  { id: 'torrent', name: 'Torrent Power', region: 'Pune / Thane' },
];

export function ProviderSelector({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) {
  return (
    <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 mb-10 pb-4 md:pb-0 custom-scrollbar-dark snap-x">
      {providers.map((p) => (
        <motion.div
          key={p.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(p.id)}
          className={clsx(
            "cursor-pointer p-6 rounded-[2rem] border-2 transition-all text-center relative overflow-hidden group snap-center min-w-[200px] md:min-w-0",
            selected === p.id 
              ? "border-indigo-600 bg-indigo-600/5 shadow-lg shadow-indigo-500/10" 
              : "border-border hover:border-indigo-500/30 bg-card"
          )}
        >
          {selected === p.id && (
            <motion.div 
              layoutId="provider-glow"
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"
            />
          )}
          <p className={clsx(
            "text-xs font-black uppercase tracking-widest mb-1",
            selected === p.id ? "text-indigo-600" : "text-foreground"
          )}>
            {p.name}
          </p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight">{p.region}</p>
          
          <div className={clsx(
            "mt-4 w-2 h-2 rounded-full mx-auto transition-all",
            selected === p.id ? "bg-indigo-600 scale-125" : "bg-border group-hover:bg-indigo-500/30"
          )} />
        </motion.div>
      ))}
    </div>
  );
}
