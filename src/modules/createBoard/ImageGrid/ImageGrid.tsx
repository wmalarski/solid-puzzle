import { For, createSignal, type Component } from "solid-js";
import { Button } from "~/components/Button";
import { Carousel, CarouselItem } from "~/components/Carousel";
import { ArrowLeftIcon } from "~/components/Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "~/components/Icons/ArrowRightIcon";
import { getImages } from "~/utils/images";

type ImageGridProps = {
  hasDefault?: boolean;
  name: string;
};

const scrollWidth = 200;

export const ImageGrid: Component<ImageGridProps> = (props) => {
  const [root, setRoot] = createSignal<HTMLDivElement>();

  const onLeftClick = () => {
    root()?.scrollBy({ behavior: "smooth", left: -scrollWidth });
  };

  const onRightClick = () => {
    root()?.scrollBy({ behavior: "smooth", left: scrollWidth });
  };

  const images = getImages();

  return (
    <div class="relative">
      <Carousel ref={setRoot}>
        <For each={images}>
          {(image, index) => (
            <CarouselItem>
              <input
                id={`image-${image}`}
                name={props.name}
                type="radio"
                value={image}
                class="peer sr-only"
                checked={props.hasDefault && index() === 0}
              />
              <label
                class="flex rounded p-2 peer-checked:bg-base-200"
                for={`image-${image}`}
              >
                <img src={image} alt={""} />
              </label>
            </CarouselItem>
          )}
        </For>
        <Button
          class="absolute left-1 top-1/2"
          onClick={onLeftClick}
          shape="circle"
          size="sm"
          type="button"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          class="absolute right-1 top-1/2"
          onClick={onRightClick}
          shape="circle"
          size="sm"
          type="button"
        >
          <ArrowRightIcon />
        </Button>
      </Carousel>
    </div>
  );
};
