import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building2, Link as LinkIcon } from 'lucide-react';

interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobLink?: string;
}

const JobCheckForm: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    companyName: '',
    jobLink: '',
  });
  const [focused, setFocused] = useState<string>('');
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('jobCheckData', JSON.stringify(formData));
    navigate('/check');
  };

  const handleFocus = (name: string) => {
    setFocused(name);
  };

  const handleBlur = () => {
    setFocused('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label 
            htmlFor="jobTitle" 
            className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              focused === 'jobTitle' ? 'text-blue-400' : 'text-white/80'
            }`}
          >
            Job Title *
          </label>
          <div className={`relative group ${
            focused === 'jobTitle' ? 'ring-2 ring-blue-500/50' : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className={`h-5 w-5 transition-colors duration-200 ${
                focused === 'jobTitle' ? 'text-blue-400' : 'text-white/40'
              }`} />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              onFocus={() => handleFocus('jobTitle')}
              onBlur={handleBlur}
              placeholder="Enter the exact job title from the posting"
              required
              className="w-full pl-10 pr-4 py-3 glass-input bg-white/5 border border-white/10 focus:border-blue-500/50 transition-all duration-200 outline-none"
            />
          </div>
        </div>
        
        <div className="relative">
          <label 
            htmlFor="companyName" 
            className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              focused === 'companyName' ? 'text-blue-400' : 'text-white/80'
            }`}
          >
            Company Name *
          </label>
          <div className={`relative group ${
            focused === 'companyName' ? 'ring-2 ring-blue-500/50' : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className={`h-5 w-5 transition-colors duration-200 ${
                focused === 'companyName' ? 'text-blue-400' : 'text-white/40'
              }`} />
            </div>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onFocus={() => handleFocus('companyName')}
              onBlur={handleBlur}
              placeholder="Company name as shown in the job posting"
              required
              className="w-full pl-10 pr-4 py-3 glass-input bg-white/5 border border-white/10 focus:border-blue-500/50 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="relative">
        <label 
          htmlFor="jobLink" 
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            focused === 'jobLink' ? 'text-blue-400' : 'text-white/80'
          }`}
        >
          Job Link (Optional)
        </label>
        <div className={`relative group ${
          focused === 'jobLink' ? 'ring-2 ring-blue-500/50' : ''
        }`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className={`h-5 w-5 transition-colors duration-200 ${
              focused === 'jobLink' ? 'text-blue-400' : 'text-white/40'
            }`} />
          </div>
          <input
            type="url"
            id="jobLink"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            onFocus={() => handleFocus('jobLink')}
            onBlur={handleBlur}
            placeholder="Paste the full URL of the job posting (if available)"
            className="w-full pl-10 pr-4 py-3 glass-input bg-white/5 border border-white/10 focus:border-blue-500/50 transition-all duration-200 outline-none"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="w-full glass-button text-white font-medium py-3 px-6 inline-flex items-center justify-center hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Search className="mr-2 h-5 w-5" />
          Check This Job
        </button>
      </div>
    </form>
  );
};

export default JobCheckForm;