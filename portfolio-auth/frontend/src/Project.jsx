import CaveDiver from '/assets/CaveDiver.png';
import Nyctophobia from '/assets/Nyctophobia.png';

const staticProjects = [
    {
        id: 1, title: "Nyctophobia",
        description: "2D maze game developed in Godot with maze algorithm and AI pathfinding",
        image: Nyctophobia, tags: ["GDScript", "Game Dev"],
        link: "https://ccns.itch.io/nyctophobia"
    },
    {
        id: 2, title: "Cave Diver Game",
        description: "2D platformer game developed in Godot with custom physics and character controllers",
        image: CaveDiver, tags: ["Godot", "GDScript", "Game Dev"],
        link: "https://saynaa.itch.io/cave-diver"
    }
];

function Projects({ dynamicContent }) {
    // Use backend projects if available, fall back to static
    const backendProjects = dynamicContent?.projects;

    // Map backend projects — images still served from static assets
    const resolveImage = (imageUrl, staticImg) => {
        if (!imageUrl) return staticImg;
        if (imageUrl.startsWith('/assets/CaveDiver')) return CaveDiver;
        if (imageUrl.startsWith('/assets/Nyctophobia')) return Nyctophobia;
        return imageUrl;
    };

    const projects = backendProjects
        ? backendProjects.map((p, i) => ({
            ...p,
            image: resolveImage(p.imageUrl, staticProjects[i]?.image)
          }))
        : staticProjects;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="projects-section">
                <div className="projects-header">
                    <p className="projects-label">My Work</p>
                    <h2 className="projects-title">Projects That Define My Journey</h2>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div 
                            key={project.id} 
                            className="project-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="project-image-wrapper">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="project-image" />
                                ) : (
                                    <div style={{
                                        width: '100%', minHeight: '180px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #2d3748, #4a5568)'
                                    }}>
                                        <span style={{ fontSize: '3rem' }}>🚀</span>
                                    </div>
                                )}
                                <div className="project-overlay">
                                    {project.link ? (
                                        <a href={project.link} target="_blank" rel="noreferrer" className="view-project-btn">
                                            View Project →
                                        </a>
                                    ) : (
                                        <span className="view-project-btn" style={{ opacity: 0.5 }}>No link yet</span>
                                    )}
                                </div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                <div className="project-tags">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="projects-footer">
                    <button className="see-more-btn">See All Projects</button>
                </div>
            </div>
        </div>
    );
}

export default Projects;
