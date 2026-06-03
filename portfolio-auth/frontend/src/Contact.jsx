import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

function Contact() {
    const contacts = [
        {
            name: 'GitHub',
            icon: <FaGithub />,
            link: 'https://github.com/DavidLam0101',
            color: '#333'
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedin />,
            link: 'https://linkedin.com/in/dat-lam-26a6b62b2',
            color: '#0077B5'
        },
        {
            name: 'Instagram',
            icon: <FaInstagram />,
            link: 'https://instagram.com/lntd0101',
            color: '#E4405F'
        },
        {
            name: 'Gmail',
            icon: <MdEmail />,
            link: 'mailto:your.lntd6534@gmail.com',
            color: '#EA4335'
        }
    ];

    return (
        <section className="contact-section">
            <div className="contact-container">
                <h2 className="contact-title">Let's Connect</h2>
                <p className="contact-subtitle">Find me on these platforms</p>
                
                <div className="contact-icons">
                    {contacts.map((contact, index) => (
                        <a
                            key={index}
                            href={contact.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-icon-wrapper"
                            style={{ '--icon-color': contact.color }}>
                            <div className="icon-container">
                                {contact.icon}
                            </div>
                            <span className="icon-tooltip">{contact.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Contact;