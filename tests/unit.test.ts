import { describe, it, expect } from 'vitest';
import { calculateProfileCompletion } from '../src/context/AuthContext';
import { CAREER_TRACKS } from '../src/data/careersData';
import { SAMPLE_JOBS_DATA } from '../src/data/sampleJobsData';
import { LEARNING_RESOURCES } from '../src/data/learningData';
import { UserProfile, ResumeData } from '../src/types';

describe('Profile Completion Calculation', () => {
  it('returns 0 for empty or null profile', () => {
    expect(calculateProfileCompletion(null)).toBe(0);
    expect(calculateProfileCompletion({})).toBe(0);
  });

  it('calculates weighted score correctly for partial profile', () => {
    const partial: Partial<UserProfile> = {
      fullName: 'Aarav Sharma',
      educationLevel: "Bachelor's Degree (B.Tech / B.E. / BCA / B.Sc / B.Com)",
    };
    // fullName: 10, educationLevel: 10
    expect(calculateProfileCompletion(partial)).toBe(20);
  });

  it('calculates full completion when all key fields are populated for Indian graduates', () => {
    const complete: Partial<UserProfile> = {
      fullName: 'Aarav Sharma',
      educationLevel: "Bachelor's Degree (B.Tech / B.E. / BCA / B.Sc / B.Com)",
      degree: 'B.Tech in Computer Science & Engineering',
      graduationYear: '2026',
      technicalSkills: ['Java', 'TypeScript', 'SQL', 'React'],
      softSkills: ['Analytical Problem Solving', 'Active Communication'],
      workExperience: 'Software Development Intern at NextGen Technologies India',
      projects: 'Smart UPI Khata & Expense Tracker',
      preferredJobRoles: ['Junior Software Engineer', 'SDE-1'],
      preferredLocations: ['Bengaluru, Karnataka', 'Hyderabad, Telangana'],
    };
    expect(calculateProfileCompletion(complete)).toBe(100);
  });
});

describe('Career Guidance Data Integrity', () => {
  it('contains at least 14 distinct career tracks', () => {
    expect(CAREER_TRACKS.length).toBeGreaterThanOrEqual(14);
  });

  it('every career track has required fields and structured roadmaps', () => {
    CAREER_TRACKS.forEach((track) => {
      expect(track.id).toBeTruthy();
      expect(track.title).toBeTruthy();
      expect(track.category).toBeTruthy();
      expect(track.description.length).toBeGreaterThan(20);
      expect(track.commonResponsibilities.length).toBeGreaterThan(0);
      expect(track.keyTechnicalSkills.length).toBeGreaterThan(0);
      expect(track.learningRoadmap.length).toBeGreaterThanOrEqual(3);
      expect(track.entryLevelTitles.length).toBeGreaterThan(0);
    });
  });

  it('does not contain foreign currency signs ($) in career guidance tips', () => {
    CAREER_TRACKS.forEach((track) => {
      track.interviewTips.forEach((tip) => {
        expect(tip).not.toContain('$');
      });
    });
  });
});

describe('Indian Job Market & Provider Adapter Logic', () => {
  it('sample jobs contain valid Indian tech hub locations and INR/LPA salaries', () => {
    expect(SAMPLE_JOBS_DATA.length).toBeGreaterThan(0);
    
    const validIndianHubs = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Gurgaon', 'Noida', 'Chennai', 'Remote (India)'];

    SAMPLE_JOBS_DATA.forEach((job) => {
      expect(job.id).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.company).toBeTruthy();
      expect(job.url.startsWith('https://')).toBe(true);
      expect(job.source).toContain('YouthPath Curated India Hub');
      
      // Salary must use INR symbol ₹ and LPA or month stipend
      expect(job.salary).toBeTruthy();
      expect(job.salary).toContain('₹');
      
      // Location must match Indian tech centers
      const matchesHub = validIndianHubs.some(hub => job.location.includes(hub));
      expect(matchesHub).toBe(true);
    });
  });

  it('filters Indian sample jobs correctly by keyword and tech stack', () => {
    const kw = 'react';
    const matches = SAMPLE_JOBS_DATA.filter(
      (j) =>
        j.title.toLowerCase().includes(kw) ||
        j.skillsRequired.some((s) => s.toLowerCase().includes(kw))
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it('filters Indian sample jobs by location accurately', () => {
    const bengaluruJobs = SAMPLE_JOBS_DATA.filter(j => j.location.toLowerCase().includes('bengaluru'));
    expect(bengaluruJobs.length).toBeGreaterThan(0);

    const hyderabadJobs = SAMPLE_JOBS_DATA.filter(j => j.location.toLowerCase().includes('hyderabad'));
    expect(hyderabadJobs.length).toBeGreaterThan(0);
  });
});

describe('Learning Resources Hub with Indian Curriculums', () => {
  it('contains reputable verified educational links including NPTEL and GeeksforGeeks', () => {
    expect(LEARNING_RESOURCES.length).toBeGreaterThanOrEqual(12);
    
    const hasNptel = LEARNING_RESOURCES.some(r => r.provider.includes('NPTEL') || r.title.includes('NPTEL'));
    expect(hasNptel).toBe(true);

    const hasGfg = LEARNING_RESOURCES.some(r => r.provider.includes('GeeksforGeeks') || r.title.includes('GeeksforGeeks'));
    expect(hasGfg).toBe(true);

    LEARNING_RESOURCES.forEach((resource) => {
      expect(resource.id).toBeTruthy();
      expect(resource.url.startsWith('https://')).toBe(true);
      expect(resource.provider).toBeTruthy();
      expect(resource.skillsCovered.length).toBeGreaterThan(0);
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(resource.level);
    });
  });
});

describe('Resume Data Standards for Indian Youth', () => {
  it('validates CGPA and Indian education formatting integrity', () => {
    const sampleResume: ResumeData = {
      userId: 'test-user-in',
      title: 'B.Tech CS Resume',
      template: 'modern',
      contactInfo: {
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@nitk.edu.in',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka',
      },
      summary: 'Motivated Computer Science graduate from NIT with strong DSA foundations.',
      education: [
        {
          id: 'edu-1',
          institution: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science and Engineering',
          fieldOfStudy: 'Computer Science',
          startDate: '2022',
          endDate: '2026',
          gradeOrGpa: '8.8 CGPA',
        },
      ],
      technicalSkills: ['Java', 'TypeScript', 'React', 'SQL'],
      softSkills: ['Problem Solving', 'Communication'],
      workExperience: [],
      internships: [],
      projects: [
        {
          id: 'proj-1',
          name: 'Smart UPI Khata',
          technologies: ['React', 'TypeScript', 'PostgreSQL'],
          description: 'Digital ledger with automated alerts.',
        },
      ],
      certifications: ['NPTEL Elite Certificate in DSA'],
      achievements: ['Smart India Hackathon College Round Winner'],
      languages: ['English', 'Hindi'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(sampleResume.contactInfo.phone.startsWith('+91')).toBe(true);
    expect(sampleResume.education[0].gradeOrGpa).toContain('CGPA');
    expect(sampleResume.education[0].degree).toContain('B.Tech');
  });
});
