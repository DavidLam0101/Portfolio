import profilePic from '/assets/PFP.jpg'

function Cards (){
    return (
        <div className ="Cards">
            <img className ="CardImage" src = {profilePic} alt ="ProfilePic"></img>
        </div>
    );

}

export default Cards