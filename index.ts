export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Zásady ochrany osobních údajů
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Jaká data sbíráme
            </h2>
            <p className="leading-relaxed">
              Při registraci sbíráme váš email a jméno. Během používání aplikace
              ukládáme informace o vašem týmu (vybraní hráči, utracený rozpočet)
              a body získané vašimi hráči v zápasech.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Jak používáme vaše data
            </h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Pro správu vašeho účtu a týmu</li>
              <li>Pro zobrazení žebříčku a porovnání s ostatními hráči</li>
              <li>Pro komunikaci ohledně aplikace (pokud je to nutné)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Přístup administrátorů k datům
            </h2>
            <p className="leading-relaxed mb-3">
              Administrátoři aplikace mají přístup k následujícím údajům pro
              účely správy aplikace:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Vaše jméno a email</li>
              <li>Informace o vašem týmu (vybraní hráči, utracený rozpočet)</li>
              <li>Celkové body vašeho týmu</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Administrátoři používají tyto údaje výhradně pro:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Přidávání nových zápasů</li>
              <li>Zadávání statistik hráčů a bodů</li>
              <li>Správu uživatelských účtů (na žádost uživatele)</li>
              <li>Řešení technických problémů</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Administrátoři jsou zavázáni chránit vaše osobní údaje a
              nepoužívat je k jiným účelům než ke správě aplikace.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Sdílení dat
            </h2>
            <p className="leading-relaxed">
              Vaše jméno, vybraní hráči a celkové body jsou viditelné ostatním
              uživatelům v žebříčku. Váš email není veřejně zobrazen a není
              sdílen s třetími stranami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Uchovávání dat
            </h2>
            <p className="leading-relaxed">
              Vaše data uchováváme po dobu, kdy je váš účet aktivní. Pokud si
              přejete smazat svůj účet, všechna vaše data budou trvale
              odstraněna z našich systémů do 30 dnů od žádosti o smazání.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Smazání účtu a dat
            </h2>
            <p className="leading-relaxed">
              Svůj účet a všechna související data můžete kdykoli smazat v sekci
              Nastavení v aplikaci pomocí tlačítka "Smazat účet". Smazání je
              nevratné a okamžitě odstraní:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed mt-2">
              <li>Váš uživatelský účet</li>
              <li>Informace o vašem týmu</li>
              <li>Historii změn týmu</li>
              <li>Všechny související záznamy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Zabezpečení dat
            </h2>
            <p className="leading-relaxed">
              Vaše data jsou uložena v zabezpečené databázi s šifrovaným
              připojením. Hesla jsou ukládána pomocí moderních hashovacích
              algoritmů. Přístup k datům mají pouze autorizovaní administrátoři
              aplikace.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Služby třetích stran
            </h2>
            <p className="leading-relaxed">
              Aplikace využívá platformu Anything pro hosting a autentizaci.
              Vaše přihlašovací údaje jsou spravovány bezpečně prostřednictvím
              této platformy. Nepoužíváme analytické nástroje třetích stran ani
              reklamní sítě.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Herní měna
            </h2>
            <p className="leading-relaxed">
              "Body rozpočtu" používané pro výběr hráčů jsou pouze herní měna
              bez reálné hodnoty. Tato aplikace není hazardní hra, neobsahuje
              žádné prvky hazardu a nevyžaduje žádné platby skutečnými penězi.
              Všichni uživatelé začínají se stejným rozpočtem 900 bodů.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Děti a ochrana soukromí
            </h2>
            <p className="leading-relaxed">
              Tato aplikace je určena pro uživatele všech věkových kategorií.
              Pokud je uživatel mladší 13 let, doporučujeme, aby registraci
              provedl rodič nebo zákonný zástupce.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Vaše práva
            </h2>
            <p className="leading-relaxed">Máte právo:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed mt-2">
              <li>Přistupovat ke svým osobním údajům</li>
              <li>Opravit nesprávné údaje</li>
              <li>Smazat svůj účet a všechna data</li>
              <li>Požádat o export svých dat</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Změny těchto zásad
            </h2>
            <p className="leading-relaxed">
              Tyto zásady můžeme čas od času aktualizovat. O významných změnách
              vás budeme informovat prostřednictvím aplikace nebo emailem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Kontakt
            </h2>
            <p className="leading-relaxed">
              Pokud máte dotazy ohledně ochrany osobních údajů nebo chcete
              uplatnit svá práva, kontaktujte administrátora aplikace.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
            Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ")}
          </p>
        </div>
      </div>
    </div>
  );
}
