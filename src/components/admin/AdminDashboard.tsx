import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, BarChart3, Settings, LogOut, ChevronRight, Plus, Trash2, Edit2, Save, X, Activity, Box, Terminal as TerminalIcon, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone, Video, FileImage, MousePointer2, Users, MapPin, Radio, Wallet, MessageSquare, Utensils, User } from 'lucide-react';
import { useProjectsContext } from '../../context/ProjectsContext';
import { Project, ProjectStatus } from '../../types';
import { auth, db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { collection, query, orderBy, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useConfig } from '../../hooks/useConfig';
import { Terminal } from '../ui/Terminal';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { useTerminalLogs } from '../../hooks/useTerminalLogs';

// Expanded icon map for selection
const ICON_OPTIONS = [
  { name: 'Radio', icon: Radio },
  { name: 'Wallet', icon: Wallet },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Utensils', icon: Utensils },
  { name: 'Box', icon: Box },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Cpu', icon: Cpu },
  { name: 'Database', icon: Database },
  { name: 'Server', icon: Server },
  { name: 'Code2', icon: Code2 },
  { name: 'Monitor', icon: Monitor },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Zap', icon: Zap },
  { name: 'Globe', icon: Globe }
];

const FRONTEND_OPTIONS = ['React', 'Vue', 'Next.js', 'React Native', 'Flutter', 'Svelte', 'Tailwind CSS'];
const BACKEND_OPTIONS = ['Node.js', 'Python', 'FastAPI', 'Go', 'Express', 'Django', 'Rust'];
const DATABASE_OPTIONS = ['Firestore', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'WatermelonDB'];

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('term_access');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col pt-12">
        <div className="px-8 mb-12">
          <h2 className="text-xl font-bold text-white tracking-tighter">ADMIN.SYS</h2>
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest mt-1">Version 4.0.2</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin' ? "bg-accent/10 text-accent font-bold" : "text-text-muted hover:bg-white/5"
            )}
          >
            <Activity className="w-4 h-4" /> Dashboard
          </Link>
          <Link 
            to="/admin/projects" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin/projects' ? "bg-accent/10 text-accent font-bold" : "text-text-muted hover:bg-white/5"
            )}
          >
            <Box className="w-4 h-4" /> Project Cluster
          </Link>
          <Link 
            to="/admin/analytics" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin/analytics' ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-white/5"
            )}
          >
            <BarChart3 className="w-4 h-4" /> Intelligence
          </Link>
          <Link 
            to="/admin/identity" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin/identity' ? "bg-accent/10 text-accent font-bold" : "text-text-muted hover:bg-white/5"
            )}
          >
            <User className="w-4 h-4" /> Identity Protocol
          </Link>
          <Link 
            to="/admin/transmissions" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin/transmissions' ? "bg-accent/10 text-accent font-bold" : "text-text-muted hover:bg-white/5"
            )}
          >
            <MessageSquare className="w-4 h-4" /> Transmissions
          </Link>
          <Link 
            to="/admin/health" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm",
              location.pathname === '/admin/health' ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-white/5"
            )}
          >
            <ShieldCheck className="w-4 h-4" /> System Health
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-all text-sm font-bold uppercase tracking-widest border",
              isTerminalOpen ? "bg-accent text-black border-accent" : "text-accent border-accent/20 hover:bg-accent/5"
            )}
          >
            <TerminalIcon className="w-4 h-4" /> Terminal
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Terminate
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/projects" element={<ProjectManager />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/identity" element={<IdentityEditor />} />
          <Route path="/transmissions" element={<FeedbackDashboard />} />
          <Route path="/health" element={<SystemHealth />} />
        </Routes>

        {isTerminalOpen && (
          <div className="fixed bottom-6 right-6 w-[500px] z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-black border border-accent shadow-[0_0_50px_-12px_rgba(var(--accent-rgb),0.3)]">
              <div className="flex items-center justify-between p-3 border-b border-accent/20 bg-accent/5">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">Terminal_Node_Live</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="text-accent hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                <Terminal />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { recentVisits, visitCount, fetchStats } = useAnalytics();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = fetchStats();
    setLoading(false);
    return () => unsub();
  }, []);

  const modules = [
    { 
      id: 'projects', 
      title: 'Project Cluster', 
      desc: 'Deploy new build manifests and manage existing system cluster.',
      icon: <Box className="w-6 h-6" />,
      path: '/admin/projects'
    },
    { 
      id: 'analytics', 
      title: 'Intelligence Node', 
      desc: 'Monitor incoming traffic, geographic distribution, and bounce logs.',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/admin/analytics'
    },
    { 
      id: 'health', 
      title: 'System Health', 
      desc: 'Monitor regional node latency, database integrity, and server load.',
      icon: <ShieldCheck className="w-6 h-6" />,
      path: '/admin/health'
    }
  ];

  return (
    <div className="p-12">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tighter mb-4 uppercase italic">Admin_Terminal_Home</h2>
        <p className="text-text-muted max-w-xl font-light">Welcome, Operator. All nodes functional. Select active module for synchronization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {modules.map(mod => (
          <button 
            key={mod.id}
            onClick={() => navigate(mod.path)}
            className="p-8 bg-bg-card border border-border text-left hover:border-accent group transition-all"
          >
            <div className="text-accent mb-6 bg-accent/5 w-fit p-3 border border-accent/20 group-hover:bg-accent group-hover:text-black transition-colors">
              {mod.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{mod.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed font-light">{mod.desc}</p>
          </button>
        ))}
      </div>

      <div className="p-12 border border-dashed border-border flex items-center justify-between bg-accent/5">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center text-accent">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">Live_Node_Traffic</div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {loading ? '---' : visitCount.toLocaleString()} <span className="text-xs text-text-muted font-normal">TOTAL_HITS</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-gray-500 uppercase">System_Status</div>
          <div className="text-accent font-mono text-xs mt-1">HEALTHY_STABLE</div>
        </div>
      </div>
    </div>
  );
};

const ProjectManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectsContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyProject: Omit<Project, 'id'> = {
    title: '',
    tagline: '',
    description: '',
    env: '',
    stableSince: '',
    features: [],
    stack: [],
    impact: '',
    logic: '',
    iconName: 'Box',
    status: 'BETA_DEV',
    problemSpace: '',
    order: projects.length,
    images: [],
    videos: [],
    imageUrl: '',
    videoUrl: '',
    repoUrl: ''
  };

  return (
    <div className="p-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase">Project Cluster</h2>
          <p className="text-xs text-text-muted">Manage active build manifests and deployment states.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-accent text-black font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center gap-3"
        >
          <Plus className="w-4 h-4" /> New Deployment
        </button>
      </div>

      {projects.length === 0 && (
        <div className="p-12 border border-border bg-bg-card text-center">
          <p className="text-text-muted mb-8 italic">No projects found in the cluster. Bootstrap initial data?</p>
          <button 
            onClick={async () => {
              const { PROJECTS } = await import('../../data/mockData');
              for (const p of PROJECTS) {
                await addProject({
                    ...p,
                    images: p.imageUrl ? [p.imageUrl] : [],
                    videos: p.videoUrl ? [p.videoUrl] : []
                } as any);
              }
            }}
            className="px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest"
          >
            Bootstrap_Cluster_v1
          </button>
        </div>
      )}

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="p-6 bg-bg-card border border-border flex items-center justify-between group hover:border-accent/40 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 border border-border flex items-center justify-center text-accent">
                {p.iconName}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">{p.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest">{p.status}</span>
                  <span className="text-[10px] text-text-muted font-mono">ORDER_{p.order}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEditingId(p.id)}
                className="p-3 text-text-muted hover:text-white transition-all border border-transparent hover:border-border"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { 
                  const pass = prompt('DELETION_PROTOCOL: Enter security key (Pandoralogs):');
                  if(pass === 'Pandoralogs') {
                    deleteProject(p.id);
                  } else {
                    alert('ERR: ACCESS_DENIED.');
                  }
                }}
                className="p-3 text-text-muted hover:text-red-500 transition-all border border-transparent hover:border-border"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editingId || isAdding) && (
        <ProjectEditorCard 
          project={projects.find(p => p.id === editingId) || emptyProject}
          onClose={() => { setEditingId(null); setIsAdding(false); }}
          isNew={isAdding}
        />
      )}
    </div>
  );
};

const ProjectEditorCard = ({ project, onClose, isNew }: { project: any; onClose: () => void; isNew: boolean }) => {
  const [data, setData] = useState({
    images: [],
    videos: [],
    ...project
  });
  const { addProject, updateProject } = useProjectsContext();

  const handleSave = async () => {
    try {
      if (isNew) {
        await addProject(data);
      } else {
        await updateProject(project.id, data);
      }
      onClose();
    } catch (err) {
      alert("FAIL_SAVE: Check rules.");
    }
  };

  const toggleStack = (val: string) => {
    const currentStack = data.stack || [];
    if (currentStack.includes(val)) {
        setData({...data, stack: currentStack.filter((s: string) => s !== val)});
    } else {
        setData({...data, stack: [...currentStack, val]});
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="max-w-4xl w-full bg-[#080808] border border-border shadow-2xl flex flex-col h-[85vh]">
        <div className="p-6 border-b border-border flex justify-between items-center bg-black/40">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Deployment Editor</h3>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-white transition-all"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-[#0a0a0a]">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Title</label>
              <input 
                type="text" value={data.title} 
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                placeholder="Project name (e.g. MoMo Bridge)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Tagline</label>
              <input 
                type="text" value={data.tagline} 
                onChange={e => setData({...data, tagline: e.target.value})}
                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                placeholder="One-liner (e.g. Offline-first payment synchronizer)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase">Description</label>
            <textarea 
              value={data.description} 
              onChange={e => setData({...data, description: e.target.value})}
              className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm min-h-[100px]"
              placeholder="Detailed project summary, goals, and outcomes..."
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Status</label>
              <select 
                value={data.status} 
                onChange={e => setData({...data, status: e.target.value})}
                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm uppercase"
              >
                <option value="PROD_READY">PROD_READY</option>
                <option value="BETA_DEV">BETA_DEV</option>
                <option value="STABLE">STABLE</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Order</label>
              <input 
                type="number" value={data.order} 
                onChange={e => setData({...data, order: parseInt(e.target.value)})}
                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Visual Identity (Icon)</label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                        <button 
                            key={opt.name}
                            onClick={() => setData({...data, iconName: opt.name})}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 border transition-all gap-2",
                                data.iconName === opt.name ? "border-accent bg-accent/10 text-accent" : "border-border text-gray-500 hover:border-gray-700"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[8px] uppercase font-mono">{opt.name}</span>
                        </button>
                    )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
             <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2"><FileImage className="w-3 h-3" /> Image Identity & Gallery</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.images?.map((img: string, idx: number) => (
                    <div key={idx} className="relative group aspect-square border border-border bg-black overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {idx === 0 && <span className="text-[8px] bg-accent text-black px-1 font-bold uppercase">Thumbnail</span>}
                            <button 
                                onClick={() => {
                                    const newImages = [...data.images];
                                    newImages.splice(idx, 1);
                                    setData({...data, images: newImages, imageUrl: newImages[0] || ''});
                                }}
                                className="p-2 bg-red-500 text-black hover:bg-white transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
                
                <label className="aspect-square border border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group">
                    <Plus className="w-6 h-6 text-gray-600 group-hover:text-accent" />
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Add_Asset</span>
                    <input 
                        type="file" accept="image/*" className="hidden" 
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const newImages = [...(data.images || []), reader.result as string];
                                    setData({...data, images: newImages, imageUrl: newImages[0]});
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2"><Video className="w-3 h-3" /> Field Demo & Overview (Video)</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.videos?.map((vid: string, idx: number) => (
                    <div key={idx} className="relative group aspect-video border border-border bg-black overflow-hidden flex items-center justify-center">
                        <Video className="w-8 h-8 text-white/20" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                             {idx === 0 && <span className="text-[8px] bg-accent text-black px-1 font-bold uppercase">Primary</span>}
                             <button 
                                onClick={() => {
                                    const newVideos = [...data.videos];
                                    newVideos.splice(idx, 1);
                                    setData({...data, videos: newVideos, videoUrl: newVideos[0] || ''});
                                }}
                                className="p-2 bg-red-500 text-black hover:bg-white transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}

                <label className="aspect-video border border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group">
                    <Plus className="w-6 h-6 text-gray-600 group-hover:text-accent" />
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Stage_Video</span>
                    <input 
                        type="file" accept="video/*" className="hidden" 
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const newVideos = [...(data.videos || []), reader.result as string];
                                    setData({...data, videos: newVideos, videoUrl: newVideos[0]});
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono text-gray-500 uppercase block">Modular Tech Stack</label>
            
            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                    <span className="text-[9px] uppercase text-accent/60 font-mono">Frontend</span>
                    <div className="flex flex-wrap gap-2">
                        {FRONTEND_OPTIONS.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => toggleStack(opt)}
                                className={cn(
                                    "px-2 py-1 text-[9px] font-mono border transition-all",
                                    data.stack?.includes(opt) ? "bg-accent text-black border-accent" : "text-text-muted border-border hover:border-accent/40"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[9px] uppercase text-accent/60 font-mono">Backend</span>
                    <div className="flex flex-wrap gap-2">
                        {BACKEND_OPTIONS.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => toggleStack(opt)}
                                className={cn(
                                    "px-2 py-1 text-[9px] font-mono border transition-all",
                                    data.stack?.includes(opt) ? "bg-accent text-black border-accent" : "text-text-muted border-border hover:border-accent/40"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[9px] uppercase text-accent/60 font-mono">Database</span>
                    <div className="flex flex-wrap gap-2">
                        {DATABASE_OPTIONS.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => toggleStack(opt)}
                                className={cn(
                                    "px-2 py-1 text-[9px] font-mono border transition-all",
                                    data.stack?.includes(opt) ? "bg-accent text-black border-accent" : "text-text-muted border-border hover:border-accent/40"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase">Impact Metrics</label>
            <textarea 
              value={data.impact} 
              onChange={e => setData({...data, impact: e.target.value})}
              className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm min-h-[80px]"
              placeholder="e.g. 40% reduction in latency for offline pings..."
            />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-mono text-gray-500 uppercase">Repository Protocol (URL)</label>
             <input 
                type="text" value={data.repoUrl || ''} 
                onChange={e => setData({...data, repoUrl: e.target.value})}
                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                placeholder="https://github.com/..."
              />
          </div>
        </div>

        <div className="p-8 bg-black/60 border-t border-border flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-[10px] font-mono text-text-muted hover:text-white transition-all uppercase tracking-widest">Abort</button>
          <button 
            onClick={handleSave} 
            className="px-10 py-3 bg-accent text-black font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center gap-3"
          >
            <Save className="w-4 h-4" /> Commit Build
          </button>
        </div>
      </div>
    </div>
  );
};

  const AnalyticsDashboard = () => {
  const { fetchStats, recentVisits, visitCount } = useAnalytics();
  const { logs: terminalLogs, deleteLogs } = useTerminalLogs();
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  
  React.useEffect(() => {
    const unsub = fetchStats();
    return () => unsub();
  }, []);

  const handleDeleteLogs = async () => {
    const pass = prompt('SECURITY_PROTOCOL: Enter override key (Pandoralogs) to purge logs:');
    if (pass === 'Pandoralogs') {
        await deleteLogs(selectedLogs);
        setSelectedLogs([]);
    } else {
        alert('ERR: ACCESS_DENIED.');
    }
  };

  const getDeviceInfo = (ua: string) => {
    if (ua.includes('iPhone')) return 'iPhone / Mobile';
    if (ua.includes('Android')) return 'Android / Mobile';
    if (ua.includes('Macintosh')) return 'Mac / Desktop';
    if (ua.includes('Windows')) return 'Windows / PC';
    return 'Generic / Edge';
  };

  // Process data for charts
  const pathData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    recentVisits.forEach(v => {
      counts[v.path] = (counts[v.path] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [recentVisits]);

  const trafficData = React.useMemo(() => {
    const daily: Record<string, number> = {};
    recentVisits.forEach(v => {
      if (v.timestamp) {
        const date = v.timestamp.toDate().toLocaleDateString();
        daily[date] = (daily[date] || 0) + 1;
      }
    });
    return Object.entries(daily)
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [recentVisits]);

  const locationData = [
    { name: 'Douala', value: 45, color: '#00FFC2' },
    { name: 'Yaoundé', value: 30, color: '#3b82f6' },
    { name: 'Garoua', value: 15, color: '#f97316' },
    { name: 'Paris', value: 10, color: '#6366f1' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-border p-4 shadow-xl font-mono">
          <p className="text-[10px] text-gray-500 uppercase mb-1">{label}</p>
          <p className="text-sm font-bold text-accent">{`Traffic: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase">Intelligence Dashboard</h2>
           <p className="text-xs text-text-muted">Real-time traffic ingestion and session telemetry.</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Global Rank</div>
              <div className="text-lg font-bold text-white tracking-widest">DLA-X01</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-8 bg-bg-card border border-border group hover:border-accent/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-[9px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Total_Visitors</p>
          <h3 className="text-3xl font-bold text-white tracking-tighter">{visitCount}</h3>
        </div>
        <div className="p-8 bg-bg-card border border-border group hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <MousePointer2 className="w-5 h-5 text-blue-500" />
            <span className="text-[9px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">89%</span>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Session_Depth</p>
          <h3 className="text-3xl font-bold text-white tracking-tighter">4.2</h3>
        </div>
        <div className="p-8 bg-bg-card border border-border group hover:border-orange-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <Activity className="w-5 h-5 text-orange-500" />
            <span className="text-[9px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">System_Load</p>
          <h3 className="text-3xl font-bold text-white tracking-tighter">0.12</h3>
        </div>
        <div className="p-8 bg-bg-card border border-border group hover:border-purple-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">STABLE</span>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Edge_Nodes</p>
          <h3 className="text-3xl font-bold text-white tracking-tighter">14</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="p-8 bg-bg-card border border-border">
            <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-8 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Growth_Telemetry
            </h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                        <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00FFC2" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#444" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#444" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="visits" 
                            stroke="#00FFC2" 
                            fillOpacity={1} 
                            fill="url(#colorVisits)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="p-8 bg-bg-card border border-border">
            <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-8 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Geo_Distribution
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 items-center h-[250px]">
                <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={locationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {locationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                    {locationData.map(item => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[11px] font-mono text-white">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 text-white">
        <div className="lg:col-span-1 p-8 bg-bg-card border border-border">
            <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-8 flex items-center gap-2">
                <LayoutGrid className="w-3 h-3" /> Path_Popularity
            </h3>
            <div className="space-y-6">
                {pathData.map(path => (
                    <div key={path.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-white truncate max-w-[150px]">{path.name}</span>
                            <span className="text-accent">{path.value} HITS</span>
                        </div>
                        <div className="h-1 bg-white/5 w-full overflow-hidden">
                            <div 
                                className="h-full bg-accent transition-all duration-1000" 
                                style={{ width: `${(path.value / (pathData[0]?.value || 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="lg:col-span-2 bg-bg-card border border-border">
            <div className="p-6 border-b border-border bg-white/5 flex justify-between items-center">
                <h4 className="text-[10px] font-mono text-white uppercase tracking-widest">Real-time_Request_Log</h4>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-accent">MONITORING_ACTIVE</span>
                </div>
            </div>
            <div className="overflow-x-auto max-h-[350px] no-scrollbar">
                <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-[#0A0A0A] z-10">
                        <tr className="border-b border-border text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                            <th className="p-4">Time</th>
                            <th className="p-4">Entity</th>
                            <th className="p-4">Path</th>
                            <th className="p-4">Protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentVisits.slice(0, 10).map((v, i) => (
                            <tr key={i} className="border-b border-border/40 hover:bg-white/[0.02] transition-all group">
                                <td className="p-4 font-mono text-[10px] text-gray-500 group-hover:text-white">
                                    {v.timestamp?.toDate().toLocaleTimeString() || 'STREAMING'}
                                </td>
                                <td className="p-4 text-[9px] text-accent/60 max-w-[120px] truncate font-mono">
                                    {getDeviceInfo(v.userAgent)}
                                </td>
                                <td className="p-4 text-[10px] text-white font-mono">
                                    {v.path}
                                </td>
                                <td className="p-4 text-[9px] text-gray-500 uppercase font-mono">
                                    {v.userAgent.substring(0, 30)}...
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Terminal Command Logs Section */}
      <div className="bg-bg-card border border-border mt-12">
        <div className="p-6 border-b border-border bg-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h4 className="text-[10px] font-mono text-white uppercase tracking-widest">Terminal_Command_Telemetry</h4>
                {selectedLogs.length > 0 && (
                    <button 
                        onClick={handleDeleteLogs}
                        className="px-3 py-1 bg-red-500 text-black text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-white transition-all"
                    >
                        Purge_{selectedLogs.length}_Logs
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                TOTAL_CAPTURED: {terminalLogs.length}
            </div>
        </div>
        <div className="overflow-x-auto max-h-[500px] no-scrollbar">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#0A0A0A] z-10">
                    <tr className="border-b border-border text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                        <th className="p-4 w-10">
                            <input 
                                type="checkbox" 
                                onChange={(e) => {
                                    if(e.target.checked) setSelectedLogs(terminalLogs.map(l => l.id));
                                    else setSelectedLogs([]);
                                }}
                                checked={selectedLogs.length === terminalLogs.length && terminalLogs.length > 0}
                                className="accent-accent bg-black border-border"
                            />
                        </th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Command</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Identity / Device</th>
                    </tr>
                </thead>
                <tbody>
                    {terminalLogs.map((log) => (
                        <tr key={log.id} className={cn(
                            "border-b border-border/40 hover:bg-white/[0.02] transition-all group",
                            !log.isAuthorized && "bg-red-500/[0.02]"
                        )}>
                            <td className="p-4">
                                <input 
                                    type="checkbox" 
                                    checked={selectedLogs.includes(log.id)}
                                    onChange={() => {
                                        if(selectedLogs.includes(log.id)) setSelectedLogs(selectedLogs.filter(id => id !== log.id));
                                        else setSelectedLogs([...selectedLogs, log.id]);
                                    }}
                                    className="accent-accent bg-black border-border"
                                />
                            </td>
                            <td className="p-4 font-mono text-[10px] text-gray-500">
                                {log.timestamp?.toDate().toLocaleString() || '---'}
                            </td>
                            <td className="p-4 text-[11px] font-mono text-white">
                                <span className="text-accent/60 mr-2">$</span> {log.command}
                            </td>
                            <td className="p-4">
                                <span className={cn(
                                    "text-[9px] font-mono px-2 py-0.5 border uppercase tracking-[0.2em]",
                                    log.isAuthorized ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-red-500 border-red-500/20 bg-red-500/5 animate-pulse"
                                )}>
                                    {log.isAuthorized ? 'AUTHORIZED' : 'BREACH_ATTEMPT'}
                                </span>
                            </td>
                            <td className="p-4 text-[9px] text-gray-500 font-mono">
                                {getDeviceInfo(log.userAgent)} <span className="opacity-30">({log.userId.substring(0, 8)})</span>
                            </td>
                        </tr>
                    ))}
                    {terminalLogs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-text-muted italic font-mono text-xs">
                                No terminal telemetry captured. Nodes silent.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const SystemHealth = () => {
    const nodes = [
        { name: 'HUB_DOUALA_CENTRAL', status: 'Healthy', latency: '12ms', load: '14%', region: 'Littoral' },
        { name: 'NODE_YAOUNDE_V', status: 'Healthy', latency: '45ms', load: '32%', region: 'Centre' },
        { name: 'EDGE_GOUA_01', status: 'Degraded', latency: '142ms', load: '88%', region: 'North' },
        { name: 'RELAY_BUEA_STATION', status: 'Healthy', latency: '28ms', load: '10%', region: 'South West' }
    ];

    return (
        <div className="p-12">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase">System Integrity Monitor</h2>
                <p className="text-xs text-text-muted">Distributed edge node telemetry and regional load distribution.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="p-8 border border-border bg-bg-card">
                    <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Regional Topology
                    </h3>
                    <div className="space-y-6">
                        {nodes.map(node => (
                            <div key={node.name} className="flex items-center justify-between p-4 bg-black/40 border border-border/40 hover:border-accent/40 transition-all">
                                <div>
                                    <div className="text-[11px] font-bold text-white uppercase">{node.name}</div>
                                    <div className="text-[9px] font-mono text-gray-500">{node.region}</div>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "text-[9px] font-mono uppercase",
                                        node.status === 'Healthy' ? "text-accent" : "text-orange-500"
                                    )}>{node.status}</div>
                                    <div className="text-[10px] text-white font-mono">{node.latency}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 border border-border bg-bg-card flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 rounded-full border-2 border-accent/20 border-t-accent animate-spin flex items-center justify-center p-4">
                        <div className="w-32 h-32 rounded-full border border-accent/10 flex items-center justify-center animate-pulse">
                            <Zap className="w-12 h-12 text-accent" />
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="text-[10px] font-mono text-accent mb-2 uppercase tracking-widest">Global Energy Efficiency</div>
                        <div className="text-4xl font-bold text-white tracking-tighter">94.2% <span className="text-sm font-normal text-gray-500">OPTIMIZED</span></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                    { label: 'DB Connections', value: '42 Active', color: 'text-accent' },
                    { label: 'Cache Hit Rate', value: '89.4%', color: 'text-blue-500' },
                    { label: 'Write Latency', value: '1.2ms', color: 'text-accent' },
                    { label: 'Storage Quota', value: '0.02 / 5GB', color: 'text-gray-400' }
                 ].map(stat => (
                    <div key={stat.label} className="p-6 bg-bg-card border border-border">
                        <div className="text-[9px] font-mono text-gray-500 uppercase mb-1">{stat.label}</div>
                        <div className={cn("text-lg font-bold tracking-tight", stat.color)}>{stat.value}</div>
                    </div>
                 ))}
            </div>
        </div>
    );
};

const IdentityEditor = () => {
    const { config, updateConfig, loading } = useConfig();
    const [data, setData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !data) {
            setData(config || {
                memberName: '',
                memberTitle: '',
                heroTitle: '',
                heroSubtitle: '',
                aboutText: '',
                email: '',
                githubUrl: '',
                linkedinUrl: '',
                twitterUrl: '',
                profileImageUrl: ''
            });
        } else if (config && !data) {
            setData(config);
        }
    }, [config, loading]);

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        try {
            await updateConfig(data);
            alert('SUCCESS: Identity baseline updated.');
        } catch (e) {
            alert('ERR: Update failed. Check terminal logs.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="p-12 flex items-center justify-center text-accent font-mono text-xs animate-pulse">
                SYNCING_IDENTITY_MANIFEST...
            </div>
        );
    }

    return (
        <div className="p-12 max-w-4xl">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase italic flex items-center gap-4">
                    <User className="w-8 h-8 text-accent" /> Identity Protocol
                </h2>
                <p className="text-xs text-text-muted">Modify global system identity, profile assets, and bio signatures.</p>
            </div>

            <div className="space-y-8 bg-bg-card border border-border p-12">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Operator_Legal_Name</label>
                        <input 
                            type="text" 
                            value={data.memberName || ''} 
                            onChange={e => setData({...data, memberName: e.target.value})}
                            className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                            placeholder="e.g. Etienne Dante"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">System_Title</label>
                        <input 
                            type="text" 
                            value={data.memberTitle || ''} 
                            onChange={e => setData({...data, memberTitle: e.target.value})}
                            className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                            placeholder="e.g. Fullstack Mobility Engineer"
                        />
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">Hero_Title_Protocol</label>
                            <input 
                                type="text" 
                                value={data.heroTitle || ''} 
                                onChange={e => setData({...data, heroTitle: e.target.value})}
                                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                                placeholder="Large heading text (e.g. BUILDING FOR THE NEXT BILLION.)"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">Hero_Subtitle_Manifest</label>
                            <input 
                                type="text" 
                                value={data.heroSubtitle || ''} 
                                onChange={e => setData({...data, heroSubtitle: e.target.value})}
                                className="w-full bg-black border border-border p-3 text-white focus:border-accent outline-none text-sm"
                                placeholder="Secondary heading text (e.g. Resilient systems in unstable environments.)"
                            />
                        </div>
                    </div>
                    
                    <div className="w-48 space-y-4">
                        <label className="text-[10px] font-mono text-gray-500 uppercase block text-center">Visual_Identity</label>
                        <div className="aspect-square bg-black border border-border relative group overflow-hidden">
                            {data.profileImageUrl ? (
                                <img src={data.profileImageUrl} alt="Identity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-800">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-[9px] font-mono font-bold text-accent">REPLACE_AVATAR</span>
                                <input 
                                    type="file" accept="image/*" className="hidden" 
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setData({...data, profileImageUrl: reader.result as string});
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {data.profileImageUrl && (
                            <button 
                                onClick={() => setData({...data, profileImageUrl: ''})}
                                className="w-full text-[9px] font-mono text-red-500 uppercase tracking-tighter hover:underline"
                            >
                                Purge_Asset
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase">Biography_Data_Stream</label>
                    <textarea 
                        value={data.aboutText || ''} 
                        onChange={e => setData({...data, aboutText: e.target.value})}
                        className="w-full bg-black border border-border p-4 text-white focus:border-accent outline-none text-sm min-h-[120px] font-light leading-relaxed no-scrollbar"
                        placeholder="Detailed personal overview and philosophy..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Communication_Channels</label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <span className="text-[9px] font-mono text-gray-700 block tracking-widest uppercase">Direct_Secure_Line (Email)</span>
                                <input 
                                    type="email" 
                                    value={data.email || ''} 
                                    onChange={e => setData({...data, email: e.target.value})}
                                    className="w-full bg-black border-b border-border p-2 text-white focus:border-accent outline-none text-xs"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">External_Node_Links</label>
                        <div className="grid grid-cols-1 gap-4">
                            <input 
                                type="text" placeholder="GitHub URL"
                                value={data.githubUrl || ''} 
                                onChange={e => setData({...data, githubUrl: e.target.value})}
                                className="w-full bg-black border-b border-border p-2 text-white focus:border-accent outline-none text-xs"
                            />
                            <input 
                                type="text" placeholder="LinkedIn URL"
                                value={data.linkedinUrl || ''} 
                                onChange={e => setData({...data, linkedinUrl: e.target.value})}
                                className="w-full bg-black border-b border-border p-2 text-white focus:border-accent outline-none text-xs"
                            />
                            <input 
                                type="text" placeholder="Twitter/X URL"
                                value={data.twitterUrl || ''} 
                                onChange={e => setData({...data, twitterUrl: e.target.value})}
                                className="w-full bg-black border-b border-border p-2 text-white focus:border-accent outline-none text-xs"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-12 py-4 bg-accent text-black font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? 'UPLOADING...' : (
                            <>
                                <Save className="w-4 h-4" /> COMMIT_ALL_CHANGES
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeedbackDashboard = () => {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setFeedback(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('DELETE_TRANSMISSION: Are you sure?')) return;
        try {
            await deleteDoc(doc(db, 'feedback', id));
            setFeedback(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            alert('ERR: Delete failed.');
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center text-accent font-mono text-xs animate-pulse">
                INTERCEPTING_UPLINKS...
            </div>
        );
    }

    return (
        <div className="p-12 max-w-6xl">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase italic flex items-center gap-4">
                        <MessageSquare className="w-8 h-8 text-accent" /> Transmission Log
                    </h2>
                    <p className="text-xs text-text-muted uppercase font-mono tracking-widest">Intercepted signals from external entities.</p>
                </div>
                <button 
                    onClick={fetchFeedback}
                    className="p-3 border border-accent/20 text-accent hover:bg-accent hover:text-black transition-all flex items-center gap-2 text-[10px] font-mono uppercase"
                >
                    <Activity className="w-3 h-3" /> Refresh_Sync
                </button>
            </div>

            <div className="space-y-4">
                {feedback.length === 0 ? (
                    <div className="p-20 border border-dashed border-border flex flex-col items-center justify-center text-gray-700">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em]">Zero transmissions detected.</span>
                    </div>
                ) : (
                    feedback.map((f, i) => (
                        <div key={f.id} className="bg-bg-card border border-border p-8 group hover:border-accent/30 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDelete(f.id)}
                                    className="p-2 text-red-500 hover:bg-red-500/10 transition-all"
                                    title="Purge Transmission"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-48 flex-shrink-0">
                                    <div className="text-[10px] font-mono text-accent mb-1 uppercase tracking-tighter">Identity_Signature</div>
                                    <div className="text-sm text-white font-bold truncate mb-4">{f.contact}</div>
                                    
                                    <div className="text-[9px] font-mono text-gray-600 mb-1 uppercase">Intercept_Time</div>
                                    <div className="text-[10px] text-gray-500 font-mono">
                                        {f.timestamp?.toDate ? f.timestamp.toDate().toLocaleString() : 'PENDING...'}
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">Payload_Data</div>
                                    <div className="text-sm text-white font-light leading-relaxed whitespace-pre-line bg-black/40 p-6 border border-white/5 italic">
                                        "{f.message}"
                                    </div>
                                    <div className="mt-4 flex gap-4 text-[9px] font-mono text-gray-700 uppercase italic">
                                        <span>UA: {f.userAgent?.slice(0, 50)}...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
