import { For, type Component } from "solid-js";
import { images } from "./ImageGrid.utils";

type ImageGridProps = {
  name: string;
};

export const ImageGrid: Component<ImageGridProps> = (props) => {
  return (
    <div>
      <For each={images}>
        {(image) => (
          <div>
            <input
              id={`image-${image}`}
              name={props.name}
              type="radio"
              value={image}
              class="peer checked:p-4"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              class="peer-checked:rounded peer-checked:border-neutral peer-checked:p-4"
              for={`image-${image}`}
            >
              <img src={image} alt={""} />
            </label>
          </div>
        )}
      </For>
    </div>
  );
};
