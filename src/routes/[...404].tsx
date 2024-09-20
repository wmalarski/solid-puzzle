import { useI18n } from "~/contexts/I18nContext";
import { Head } from "~/modules/common/Head";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <Head title={t("notFound.title")} />
      <h1 class="my-16 text-6xl font-thin uppercase text-sky-700">
        {t("notFound.title")}
      </h1>
    </main>
  );
}
