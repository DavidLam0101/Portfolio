import { useState } from 'react';
import pfp from '/assets/AboutMePFP.jpg';
import University from '/assets/CarletonUniversity.jpg';

function AboutMe({ dynamicContent }) {
    const [activeTab, setActiveTab] = useState('intro');

    const aboutText = dynamicContent?.aboutMeText || null;

    return (
        <div id="AboutMe" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 5%'}}>
            <div className="AboutMeSection">
                <img className="AboutMeImage" src={pfp} alt="ProfilePicture" />
                
                <div className="AboutMeContent">
                    <div className="AboutMeTabs">
                        <div 
                            className={`AboutMeTab ${activeTab === 'intro' ? 'active' : ''}`}
                            onClick={() => setActiveTab('intro')}
                        >
                            <button className='infoBtn'>About Me</button>
                        </div>
                        <div 
                            className={`AboutMeTab ${activeTab === 'skills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('skills')}
                        >
                            <button className="skillBtn">Skills</button>
                        </div>
                    </div>
                    <div className="AboutMeTabContent">
                        {activeTab === 'intro' ? (
                            <p className="AboutMeText">
                                {aboutText ? aboutText : (
                                    <>
                                        I'm Dat Lam, a Computer Science Honours student at{' '}
                                        <span className="university-link">
                                            Carleton University
                                            <img 
                                                src={University} 
                                                alt="Carleton University" 
                                                className="university-image"
                                            />
                                        </span>
                                        . I have experience in building full-stack websites and system-level programming.
                                        <br /><br />
                                        Currently, I'm also into game development with the Godot engine. I have made some games with my friends.
                                    </>
                                )}
                            </p>
                        ) : (
                            <div className="SkillsGrid">
                                <div className="SkillCard">
                                    <div className="SkillIcon">💻</div>
                                    <h3>Programming Languages</h3>
                                    <div className="SkillList">
                                        <span className="SkillBadge">Java</span>
                                        <span className="SkillBadge">C++</span>
                                        <span className="SkillBadge">C#</span>
                                        <span className="SkillBadge">JavaScript</span>
                                        <span className="SkillBadge">SQL</span>
                                    </div>
                                </div>

                                <div className="SkillCard">
                                    <div className="SkillIcon">🌐</div>
                                    <h3>Web Technologies</h3>
                                    <div className="SkillList">
                                        <span className="SkillBadge">HTML</span>
                                        <span className="SkillBadge">CSS</span>
                                        <span className="SkillBadge">React</span>
                                        <span className="SkillBadge">Node.js</span>
                                        <span className="SkillBadge">Spring Boot</span>
                                    </div>
                                </div>

                                <div className="SkillCard">
                                    <div className="SkillIcon">🛠️</div>
                                    <h3>Tools & Frameworks</h3>
                                    <div className="SkillList">
                                        <span className="SkillBadge">PostgreSQL</span>
                                        <span className="SkillBadge">Godot</span>
                                        <span className="SkillBadge">Git</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMe;
