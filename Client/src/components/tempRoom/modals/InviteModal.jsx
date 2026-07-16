import Modal from "../../common/Modal.jsx"
import InvitePanel from "../InvitePanel.jsx"

const InviteModal = ({onClose,link}) => {
  return (
    <Modal onClose={onClose} title="Invite People">
        <InvitePanel link={link}/>
    </Modal>
  )
}

export default InviteModal