import PromptCard from "./PromptCard"
import Modal from '@components/Modal';
import {useState} from 'react';

const Profile = ({name, desc, data, handleEdit, handleDelete}) => {
  
  //Modal
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalUser, setModalUser] = useState("");

  const handleShowModal = async (post, username) => {
    
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prompt: post.trim()}),
  })
    const data = res.json();
    console.log(data);
    setModalText(data);
    setModalUser(username);
    setShowModal(true);

    //setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalText("");
    setModalUser("");
  };

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">
        {name} Profile
        </span>    
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-10 prompt-layout">
      {data.map((post) => (
        <PromptCard 
        key={post._id}
        post={post}
        handleEdit={() => handleEdit && handleEdit(post)}
        handleDelete={() => handleDelete && handleDelete(post)}
        handleShowModal={() => handleShowModal && handleShowModal(post.prompt, post.creator.username)}
        />
      ))}
    </div>
    <Modal 
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      text={modalText}   
      userName={modalUser}   
      />
    </section>
  )
}

export default Profile