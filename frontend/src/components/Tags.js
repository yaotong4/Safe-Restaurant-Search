import React, { useState, useEffect } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Categories from './Categories';
import '../styles/Search.css';
import getCategories from '../apis/getCategories';

function Tags(props) {
  const { type, tags, setTags, showCategories } = props;
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  let input;
  let editInput;

  const[categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetch() {
      const data = await getCategories();
      setCategories(data);
    }
    fetch();
  }, [])

  useEffect(() => {
    if (input) {
      input.focus();
    }
    if (editInput) {
      editInput.focus();
    }
  })

  function handleClose(removedTag) {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  }

  function showInput() {
    setInputVisible(true);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleInputConfirm() {
    if (inputValue.trim() && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
    }
    setInputVisible(false);
    setInputValue('');
  }

  function handleEditInputChange(e) {
    setEditInputValue(e.target.value);
  }

  function handleEditInputConfirm() {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  }

  function saveInputRef(i) {
    input = i;
  }

  function saveEditInputRef(i) {
    editInput = i;
  }

  return (
    <>
    <div id="tags">
      {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 25;

          const tagElem = (
            <Tag
              color=""
              className="edit-tag"
              key={tag}
              closable
              onClose={() => handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }}
              >
                {isLongTag ? `${tag.slice(0, 15)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={showInput}>
            <PlusOutlined />{type}
          </Tag>
        )}
    </div>

    {showCategories &&
      <div id="categories">
      <Categories 
        categories={categories} 
        tags = {tags}
        setTags={setTags}
      />
    </div>
    }

    </>
  )
}

export default Tags;