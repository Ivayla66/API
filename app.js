const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const searchInput = document.getElementById('searchInput');
const mealsContainer = document.getElementById('mealsContainer');
const mealDetail = document.getElementById('mealDetail');
const mealContent = document.getElementById('mealContent');
const closeModal = document.getElementById('closeModal');

const api_base = 'https://www.themealdb.com/api/json/v1/1';

function createMealCard(meal) {
  return `
    <div class="bg-white shadow rounded overflow-hidden cursor-pointer hover:shadow-lg transition" onclick="showMealDetail(${meal.idMeal})">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover"/>
      <div class="p-4">
        <h2 class="text-lg font-semibold">${meal.strMeal}</h2>
        <p class="text-sm text-gray-500">${meal.strCategory} - ${meal.strArea}</p>
      </div>
    </div>
  `;
}

function displayMeals(meals) {
  mealsContainer.innerHTML = meals?.length
    ? meals.map(createMealCard).join('')
    : '<p class="text-center col-span-3">No meals found.</p>';
}

async function searchMeals(query) {
  const res = await fetch(`${api_base}/search.php?s=${query}`);
  const data = await res.json();
  displayMeals(data.meals);
}

async function getRandomMeal() {
  const res = await fetch(`${api_base}/random.php`);
  const data = await res.json();
  displayMeals(data.meals);
}

async function showMealDetail(id) {
  const res = await fetch(`${api_base}/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];

  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing) ingredients += `<li>${ing} - ${measure}</li>`;
  }

  mealContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" class="w-full rounded mb-4"/>
    <p class="mb-2 text-gray-600">${meal.strCategory} | ${meal.strArea}</p>
    <h3 class="text-xl font-semibold mt-4">Ingredients:</h3>
    <ul class="list-disc list-inside mb-4">${ingredients}</ul>
    <h3 class="text-xl font-semibold mt-4">Instructions:</h3>
    <p class="whitespace-pre-wrap">${meal.strInstructions}</p>
  `;

  mealDetail.classList.remove('hidden');
}

closeModal.addEventListener('click', () => mealDetail.classList.add('hidden'));
searchBtn.addEventListener('click', () => searchMeals(searchInput.value.trim()));
randomBtn.addEventListener('click', getRandomMeal);

// Default: show some meals (e.g., starting with 'a')
searchMeals('a');

// Expose to global for inline onclick
window.showMealDetail = showMealDetail;
