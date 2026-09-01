import "./ProjectCard.css";

function ProjectCard({ number, title, location, image }) {
    return (
        <div className="project-card" style={{ backgroundImage: `url(${image})` }}>
            <div className="project-card-overlay"></div>
            <span className="project-card-num">{number}</span>
            <div className="project-card-info">
                <h3>{title}</h3>
                <p>{location}</p>
            </div>

            <div className="project-card-hover">
                <span>See</span>
                <em>Project</em>
                <span>Overview</span>
            </div>
        </div>
    );
}

export default ProjectCard;