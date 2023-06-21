'use client';

import {useState, useEffect, Suspense} from 'react';
import PromptCard from './PromptCard';
import Modal from '@components/Modal';

const PromptCardList = ({ data, handleTagClick, handleShowModal}) => {
  return (
    <div className="mt-16 prompt-layout">
      {data.map((post) => (
        <PromptCard 
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
        handleShowModal={handleShowModal}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  
  const [loading, setLoading] = useState(false);

  //Get response from OPENAI
  const [response, setResponse] = useState([]);
  
  const [allPosts, setAllPosts] = useState([]);

  //Modal
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalUser, setModalUser] = useState("");


  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);

  //const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const response = await fetch('api/prompt');
    const data = await response.json();

    setAllPosts(data);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`api/generate/${e.prompt}`);
    const data = await response.json();

    setResponse(data.choices[0].text.trim());

    setLoading(false);

  }

  const handleShowModal = async (post, username) => {
    /* e.preventDefault(); */
    

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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalText("");
    setModalUser("");
  };

  useEffect(() => {
    fetchPosts();
 }, []);

 const filterPrompts = (searchtext) => {
  const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
 }

 const handleSearchChange = (e) => {
  clearTimeout(searchTimeout);
  setSearchText(e.target.value);

  // debounce method
  setSearchTimeout(
    setTimeout(() => {
      const searchResult = filterPrompts(e.target.value);
      setSearchedResults(searchResult);
    }, 500)
  );
};

const handleTagClick = (tagName) => {
  setSearchText(tagName);
  

  const searchResult = filterPrompts(tagName);
  setSearchedResults(searchResult);
};


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input 
          type="text"
          placeholder="Search for a prompt, tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />

        
      </form>
      <Modal 
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      text={modalText}   
      userName={modalUser}   
      />
      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
          handleShowModal={handleShowModal}
        />
      ) : (
        <PromptCardList 
          data={allPosts} 
          handleTagClick={handleTagClick} 
          handleShowModal={handleShowModal}
        />
      )}
{
  
       }
      
    </section>
    
  )
}

export default Feed