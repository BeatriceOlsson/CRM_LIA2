import { ButtonComponent } from "./buttonComponent";

export function PriviesNextButton({ previus, next, hasPrevius, hasNext }) {
  return (
    <div className={`flex flex-row justify-center gap-10`}>
      <ButtonComponent
        buttonText={"Föregående"}
        onMouseDown={previus}
        disable={!hasPrevius}
        className={`${!hasPrevius ? "opacity-50 pointer-events-none" : ""}`}
      />
      <ButtonComponent
        buttonText={"Nästa"}
        onMouseDown={next}
        disable={!hasNext}
        className={`${!hasNext ? "opacity-50 pointer-events-none" : ""}`}
      />
    </div>
  );
}
