
import React, { useState } from 'react';
import { resumeData } from '../data/resumeData';
import { GithubIcon, LinkedinIcon, PortfolioIcon, CloseIcon } from './Icons';

interface SidebarProps {
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-3 text-sm text-brand-gray hover:text-brand-light transition-colors duration-200 group"
  >
    <span className="w-5 h-5 text-brand-gray group-hover:text-brand-cyan transition-colors duration-200">{icon}</span>
    <span>{children}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ onPromptSelect, isLoading, isOpen, onClose }) => {
  const { name, title, github, linkedin, portfolio } = resumeData.personalInfo;
  const [showPitchInput, setShowPitchInput] = useState(false);
  const [pitchRole, setPitchRole] = useState('');

  const handleGeneratePitch = () => {
    if (pitchRole.trim()) {
      onPromptSelect(`Generate a concise, tailored pitch statement for the role of "${pitchRole}".`);
      setShowPitchInput(false);
      setPitchRole('');
      onClose(); // Close sidebar on mobile after action
    }
  };

  const handleActionClick = (prompt: string) => {
    onPromptSelect(prompt);
    onClose(); // Close sidebar on mobile after action
  };

  const ActionButton: React.FC<{ onClick: () => void, disabled: boolean, children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left text-sm font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:border-brand-pink hover:bg-brand-pink/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-pink"
    >
      {children}
    </button>
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-[85vw] max-w-[320px] bg-brand-dark/80 backdrop-blur-xl border-r border-brand-pink/20 p-6 flex flex-col text-brand-light overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-[350px]`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-brand-gray hover:text-brand-light lg:hidden">
        <CloseIcon />
      </button>

      <div className="flex-grow">
        <div className="text-center mb-8 pt-8 lg:pt-0">
          <div className="relative inline-block p-1 rounded-full bg-gradient-to-br from-brand-pink to-brand-cyan mb-4">
            <img
              src="https://i.postimg.cc/rwjfhvrk/sumitc.png"
              alt={name}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mx-auto border-4 border-brand-dark"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-brand-dark ring-2 ring-brand-dark"></div>
          </div>

          <h1 className="text-2xl font-bold text-brand-light">{name}</h1>
          <h2 className="text-md text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-cyan font-semibold">{title}</h2>
        </div>
        <div className="space-y-3 mb-8 border-t border-white/10 pt-6">
          <SocialLink href={portfolio} icon={<PortfolioIcon />}>sumitchauhandev</SocialLink>
          <SocialLink href={linkedin} icon={<LinkedinIcon />}>/in/sumit-chauhan-a4ba98325</SocialLink>
          <SocialLink href={github} icon={<GithubIcon />}>/halloffame12</SocialLink>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-light">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton
              onClick={() => handleActionClick("Summarize Sumit's key skills and expertise.")}
              disabled={isLoading}
            >
              Summarize Skills
            </ActionButton>
            <ActionButton
              onClick={() => handleActionClick("Show me Sumit's best project in AI.")}
              disabled={isLoading}
            >
              Show Best Project
            </ActionButton>
            <ActionButton
              onClick={() => setShowPitchInput(!showPitchInput)}
              disabled={isLoading}
            >
              Generate Role Pitch
            </ActionButton>
            {showPitchInput && (
              <div className="p-3 bg-white/5 rounded-lg space-y-2 border border-white/10">
                <input
                  type="text"
                  value={pitchRole}
                  onChange={(e) => setPitchRole(e.target.value)}
                  placeholder="e.g., Senior Python Developer"
                  className="w-full bg-brand-dark text-brand-light px-3 py-2 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePitch()}
                />
                <button
                  onClick={handleGeneratePitch}
                  disabled={isLoading || !pitchRole.trim()}
                  className="w-full bg-gradient-to-r from-brand-pink to-brand-cyan text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center text-xs text-brand-gray mt-6 pt-6 border-t border-white/10">
        <p>&copy; {new Date().getFullYear()} Sumit Chauhan AI Assistant</p>
      </footer>
    </div>
  );
};

export default Sidebar;