import 'react'
import Dashboard from './Dashboard/Dashboard'

// eslint-disable-next-line react/prop-types
const Track = ({ isOpen, toggleSidebar }) => {
  return <Dashboard isOpen={isOpen} toggleSidebar={toggleSidebar} />
}

export default Track

