'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '@/lib/api-client';
import { Document } from '@/lib/types';

interface SourceDrawerContextType {
  isOpen: boolean;
  activeDoc: Document | null;
  isLoading: boolean;
  openDrawerWithDoc: (doc: Document) => void;
  openDrawerWithDocId: (docId: number) => Promise<void>;
  closeDrawer: () => void;
}

const SourceDrawerContext = createContext<SourceDrawerContextType | undefined>(undefined);

export function SourceDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDrawerWithDoc = (doc: Document) => {
    setActiveDoc(doc);
    setIsOpen(true);
  };

  const openDrawerWithDocId = async (docId: number) => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const doc = await api.getDocumentDetails(docId);
      setActiveDoc(doc);
    } catch (err) {
      console.error("Failed to load document details", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setActiveDoc(null);
  };

  return (
    <SourceDrawerContext.Provider
      value={{
        isOpen,
        activeDoc,
        isLoading,
        openDrawerWithDoc,
        openDrawerWithDocId,
        closeDrawer
      }}
    >
      {children}
    </SourceDrawerContext.Provider>
  );
}

export function useSourceDrawer() {
  const context = useContext(SourceDrawerContext);
  if (!context) {
    throw new Error('useSourceDrawer must be used within a SourceDrawerProvider');
  }
  return context;
}
