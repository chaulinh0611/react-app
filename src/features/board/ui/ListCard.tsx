import { Draggable } from "@hello-pangea/dnd"

export default function ListCard({card, index}: any) {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-white rounded-md p-3 shadow-sm"
                >
                    {card.title}
                </div>
            )}
        </Draggable>
    )
}