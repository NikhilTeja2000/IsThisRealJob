import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-white/80 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            required
            className="w-full px-4 py-3 glass-input"
          />
        </div>
        
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-white/80 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Inc."
            required
            className="w-full px-4 py-3 glass-input"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="jobLink" className="block text-sm font-medium text-white/80 mb-2">
          Job Link (Optional)
        </label>
        <input
          type="url"
          id="jobLink"
          name="jobLink"
          value={formData.jobLink}
          onChange={handleChange}
          placeholder="https://example.com/job-posting"
          className="w-full px-4 py-3 glass-input"
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="w-full glass-button text-white font-medium py-3 px-6 inline-flex items-center justify-center"
        >
          <Search className="mr-2 h-5 w-5" />
          Check This Job
        </button>
      </div>
    </form>
  );
};

export default JobCheckForm;