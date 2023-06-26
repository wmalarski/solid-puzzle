import { HiSolidArrowLeft, HiSolidArrowRight } from "solid-icons/hi";
import { For, createSignal, type Component } from "solid-js";
import { Button } from "~/components/Button";
import { Carousel, CarouselItem } from "~/components/Carousel";
import { getImages } from "~/utils/images";

type ImageGridProps = {
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
                checked={index() === 0}
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
          <HiSolidArrowLeft />
        </Button>
        <Button
          class="absolute right-1 top-1/2"
          onClick={onRightClick}
          shape="circle"
          size="sm"
          type="button"
        >
          <HiSolidArrowRight />
        </Button>
      </Carousel>
    </div>
  );
};
