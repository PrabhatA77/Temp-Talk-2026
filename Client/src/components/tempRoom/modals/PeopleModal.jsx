import Modal from "../../common/Modal.jsx"
import ParticipantList from "../ParticipantList.jsx"
import useTempRoomStore from "../../../store/tempRoomStore.js"

const PeopleModal = ({onClose}) => {
  const {participants,userName,room} = useTempRoomStore();

  return (
    <Modal onClose={onClose} title="People in this room">
        <ParticipantList
          participants={participants}
          currentUserName={userName}
          hostName={room?.creatorName}
        />
    </Modal>
  )
}

export default PeopleModal