import React from 'react';

export type ProjectStatus = 'PROD_READY' | 'BETA_DEV' | 'STABLE';

export interface ProjectFeature {
  name: string;
  text: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  env: string;
  stableSince: string;
  features: ProjectFeature[];
  stack: string[];
  impact: string;
  logic: string;
  iconName: string;
  status: ProjectStatus;
  problemSpace: string;
  order: number;
  imageUrl?: string;
  videoUrl?: string;
  images?: string[];
  videos?: string[];
  repoUrl?: string;
}

export interface SystemLog {
  id: string;
  tag: string;
  title: string;
  body: string;
}
