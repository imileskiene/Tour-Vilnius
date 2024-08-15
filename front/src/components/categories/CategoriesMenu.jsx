import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CategoriesMenu({ categories }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (categoryid) => {
    handleClose();
    navigate(`/tours/category/${categoryid}`);
  };

  return (
    <div>
      <Button
        id="basic-button"
        color='inherit'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Ekskursijos
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.categoryid}
            onClick={() => handleCategoryClick(category.categoryid)}
          >
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
