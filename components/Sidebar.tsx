import React, { useState, useRef, useEffect } from 'react';
import { resumeData } from '../data/resumeData';
import { GithubIcon, LinkedinIcon, PortfolioIcon, CloseIcon } from './Icons';

interface SidebarProps {
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  // New: Optional image URL override
  profileImage?: string;
}

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-3 text-sm text-brand-gray hover:text-brand-light transition-colors duration-200 group"
    aria-label={`Visit ${children} profile`} // New: Accessibility
  >
    <span className="w-5 h-5 text-brand-gray group-hover:text-brand-cyan transition-colors duration-200">{icon}</span>
    <span>{children}</span>
  </a>
);

const ActionButton: React.FC<{ 
  onClick: () => void; 
  disabled: boolean; 
  children: React.ReactNode; 
  isLoading?: boolean; // New: For spinner
}> = ({ onClick, disabled, children, isLoading = false }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="w-full text-left text-sm font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:border-brand-pink hover:bg-brand-pink/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-pink"
    aria-label={typeof children === 'string' ? children : 'Action button'} // New: Accessibility
  >
    <span className="flex items-center justify-between">
      <span>{children}</span>
      {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />} {/* New: Spinner */}
    </span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  onPromptSelect, 
  isLoading, 
  isOpen, 
  onClose, 
  profileImage // New prop
}) => {
  const { name, title, github, linkedin, portfolio } = resumeData.personalInfo;
  const [showPitchInput, setShowPitchInput] = useState(false);
  const [pitchRole, setPitchRole] = useState('');
  const pitchInputRef = useRef<HTMLInputElement>(null); // New: For auto-focus

  // New: Auto-focus pitch input
  useEffect(() => {
    if (showPitchInput && pitchInputRef.current) {
      pitchInputRef.current.focus();
    }
  }, [showPitchInput]);

  const handleGeneratePitch = () => {
    const trimmedRole = pitchRole.trim();
    if (trimmedRole) {
      onPromptSelect(`Generate a concise, tailored pitch statement for the role of "${trimmedRole}".`);
      setShowPitchInput(false);
      setPitchRole('');
      onClose(); // Close sidebar on mobile after action
    }
  };

  const handleActionClick = (prompt: string) => {
    onPromptSelect(prompt);
    onClose(); // Close sidebar on mobile after action
  };

  const imageSrc = profileImage || 'https://i.postimg.cc/rwjfhvrk/sumitc.png'; // New: Data-driven fallback

  return (
    <nav 
      className={`fixed inset-y-0 left-0 z-30 w-[85vw] max-w-[320px] bg-brand-dark/80 backdrop-blur-xl border-r border-brand-pink/20 p-6 flex flex-col text-brand-light overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-[350px]`}
      role="navigation" // New: ARIA role
      aria-hidden={!isOpen} // New: Hidden when closed
      aria-label="Sidebar navigation"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-brand-gray hover:text-brand-light lg:hidden"
        aria-label="Close sidebar" // New: Accessibility
      >
        <CloseIcon />
      </button>
      <div className="flex-grow">
        <div className="text-center mb-8 pt-8 lg:pt-0">
          <div className="relative inline-block p-1 rounded-full bg-gradient-to-br from-brand-pink to-brand-cyan mb-4">
            <img
              src={imageSrc}
              alt={`${name}'s profile photo`} // New: Descriptive alt
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mx-auto border-4 border-brand-dark"
              onError={(e) => { // New: Error handling
                (e.target as HTMLImageElement).src = '/fallback-avatar.png'; // Assume a local fallback
              }}
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-brand-dark ring-2 ring-brand-dark"></div>
          </div>
          <h1 className="text-2xl font-bold text-brand-light">{name}</h1>
          <h2 className="text-md text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-cyan font-semibold">{title}</h2>
        </div>
        <div className="space-y-3 mb-8 border-t border-white/10 pt-6">
          {portfolio && <SocialLink href={portfolio} icon={<PortfolioIcon />}>sumitchauhandev</SocialLink>} {/* New: Conditional render */}
          {linkedin && <SocialLink href={linkedin} icon={<LinkedinIcon />}>/in/sumit-chauhan-a4ba98325</SocialLink>}
          {github && <SocialLink href={github} icon={<GithubIcon />}>/halloffame12</SocialLink>}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-light">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton
              onClick={() => handleActionClick("Summarize Sumit's key skills and expertise.")}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Summarize Skills
            </ActionButton>
            <ActionButton
              onClick={() => handleActionClick("Show me Sumit's best project in AI.")}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Show Best Project
            </ActionButton>
            <ActionButton
              onClick={() => setShowPitchInput(!showPitchInput)}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Generate Role Pitch
            </ActionButton>
            {showPitchInput && (
              <div className="p-3 bg-white/5 rounded-lg space-y-2 border border-white/10">
                <input
                  ref={pitchInputRef} // New: Auto-focus ref
                  type="text"
                  value={pitchRole}
                  onChange={(e) => setPitchRole(e.target.value)}
                  placeholder="e.g., Senior Python Developer"
                  className="w-full bg-brand-dark text-brand-light px-3 py-2 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePitch()}
                  aria-describedby="pitch-help" // New: ARIA
                />
                <p id="pitch-help" className="text-xs text-brand-gray">Enter a job role to generate a tailored pitch.</p> {/* New: Help text */}
                <button
                  onClick={handleGeneratePitch}
                  disabled={isLoading || !pitchRole.trim()}
                  className="w-full bg-gradient-to-r from-brand-pink to-brand-cyan text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 'Generate'} {/* New: Loading text */}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center text-xs text-brand-gray mt-6 pt-6 border-t border-white/10">
        <p>&copy; {new Date().getFullYear()} Sumit Chauhan AI Assistant</p>
      </footer>
    </nav>
  );
});

Sidebar.displayName = 'Sidebar'; // For debugging

export default Sidebar;
