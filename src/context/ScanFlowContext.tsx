import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { VisionAnalysisResult, ValueAiResult, PipelineProgress } from '../types/ai';
import { CircularValuePath } from '../types/item';
import { Receiver } from '../types/receiver';

export interface ScanImageData {
  file?: File;
  previewUrl: string;
}

interface ScanFlowContextValue {
  imageData: ScanImageData | null;
  visionResult: VisionAnalysisResult | null;
  valueAiResult: ValueAiResult | null;
  selectedValuePath: CircularValuePath | null;
  selectedReceiver: Receiver | null;
  pipelineProgress: PipelineProgress | null;

  setImage: (image: ScanImageData | null) => void;
  setVisionResult: (result: VisionAnalysisResult | null) => void;
  setValueAiResult: (result: ValueAiResult | null) => void;
  selectValuePath: (path: CircularValuePath) => void;
  selectReceiver: (receiver: Receiver | null) => void;
  setPipelineProgress: (progress: PipelineProgress | null) => void;
  resetFlow: () => void;
}

const ScanFlowContext = createContext<ScanFlowContextValue | null>(null);

export const ScanFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageData, setImageData] = useState<ScanImageData | null>(null);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const [valueAiResult, setValueAiResult] = useState<ValueAiResult | null>(null);
  const [selectedValuePath, setSelectedValuePath] = useState<CircularValuePath | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(null);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgress | null>(null);

  const setImage = useCallback((data: ScanImageData | null) => {
    setImageData(data);
  }, []);

  const selectValuePath = useCallback((path: CircularValuePath) => {
    setSelectedValuePath(path);
  }, []);

  const selectReceiver = useCallback((receiver: Receiver | null) => {
    setSelectedReceiver(receiver);
  }, []);

  const resetFlow = useCallback(() => {
    setImageData(null);
    setVisionResult(null);
    setValueAiResult(null);
    setSelectedValuePath(null);
    setSelectedReceiver(null);
    setPipelineProgress(null);
  }, []);

  const value = useMemo<ScanFlowContextValue>(
    () => ({
      imageData,
      visionResult,
      valueAiResult,
      selectedValuePath,
      selectedReceiver,
      pipelineProgress,
      setImage,
      setVisionResult,
      setValueAiResult,
      selectValuePath,
      selectReceiver,
      setPipelineProgress,
      resetFlow,
    }),
    [
      imageData,
      visionResult,
      valueAiResult,
      selectedValuePath,
      selectedReceiver,
      pipelineProgress,
      setImage,
      selectValuePath,
      selectReceiver,
      resetFlow,
    ]
  );

  return <ScanFlowContext.Provider value={value}>{children}</ScanFlowContext.Provider>;
};

export function useScanFlowContext(): ScanFlowContextValue {
  const ctx = useContext(ScanFlowContext);
  if (!ctx) {
    throw new Error('useScanFlowContext must be used within a ScanFlowProvider');
  }
  return ctx;
}
