import { FaLocationDot } from 'react-icons/fa6';
import Cards from './Cards.jsx';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

function Introduction({ dynamicContent }) {
    const el = useRef(null);
    const wel = useRef(null);

    const jobTitle = dynamicContent?.jobTitle || 'Computer Science Student';
    const location = dynamicContent?.location || 'Ottawa, Canada';

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: ['Dat Lam', 'David Lam'],
            typeSpeed: 150, backSpeed: 100, backDelay: 2500, loop: true,
        });
        const typed2 = new Typed(wel.current, {
            strings: ['My name is:', 'You can call me:'],
            typeSpeed: 70, backSpeed: 70, backDelay: 2500, loop: true,
        });
        return () => { typed.destroy(); typed2.destroy(); };
    }, []);

    return (
        <div className='Introduction'>
            <div className='intro-content'>
                <div className="greeting"><span ref={wel} /></div>
                <div className="name"><span ref={el} /></div>
                <p style={{ fontSize: '25px', color: 'antiquewhite' }}>
                    <FaLocationDot className='locationIcon' style={{ color: 'rgb(78, 78, 78) 100%' }} />
                    {location}
                </p>
                <h1 className='JobTitle'><span className="autoType">{jobTitle}</span></h1>
                <a style={{ width: "fit-content" }} href={`${import.meta.env.BASE_URL}assets/Resume.pdf`}
                    download="Resume.pdf">
                    <button className='resumeButton'>My Resume</button>
                </a>
            </div>
            <Cards />
        </div>
    );
}

export default Introduction;
