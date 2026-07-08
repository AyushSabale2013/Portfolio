import InfiniteMenu from "../../components/InfiniteMenu";
import projects from "../../data/projects";

export default function Projects() {
    const items = projects.map((project) => ({
        image: project.image,
        link: project.liveUrl,
        title: project.title,
        description: project.description,
    }));

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <InfiniteMenu
                items={items}
                scale={1}
            />
        </div>
    );
}