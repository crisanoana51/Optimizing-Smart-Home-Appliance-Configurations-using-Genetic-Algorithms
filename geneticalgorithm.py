import random
import psycopg2
import matplotlib.pyplot as plt
from flask import Flask, jsonify, request
from flask_cors import CORS
from decimal import Decimal


app = Flask(__name__)
CORS(app)


def get_devices_from_database():

    conn = psycopg2.connect(
        dbname="licentatest",
        user="postgres",
        password="Zambila2011!",
        host="localhost",
        port="5432"
    )

    cur = conn.cursor()

    cur.execute("SELECT id, consumption, price, category, name, url, image_url, width, height, length FROM device")

    rows = cur.fetchall()

    cur.close()
    conn.close()

    devices = []
    for row in rows:
        device = Device(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9])
        devices.append(device)

    return devices


class Device:
    def __init__(self, device_id, consumption, price, category, name, url=None, imageUrl=None, width=None, height=None, length=None):
        self.id = device_id
        self.consumption = consumption
        self.price = price
        self.category = category
        self.name = name
        self.url = url if url is not None else "No URL available"
        self.imageUrl = imageUrl if imageUrl is not None else "No image URL available"
        self.width = width
        self.height = height
        self.length = length

def initialize_population(devices, categories, population_size):
    population = []
    category_to_devices = {category: [d for d in devices if d.category == category] for category in categories}

    for _ in range(population_size):
        individual = []
        for category in categories:
            category_devices = category_to_devices[category]
            random.shuffle(category_devices)
            individual.append(random.choice(category_devices))
        population.append(individual)

    return population


def fitness(solution, budget, consumption_weight, devices):
    total_price = sum(device.price for device in solution)
    total_consumption = sum(float(device.consumption) for device in solution)

    penalty = 0
    if total_price > budget:
        penalty = (float(total_price) - budget) / float(budget)

    max_consumption = max(float(d.consumption) for d in devices)
    min_consumption = min(float(d.consumption) for d in devices)

    if max_consumption == min_consumption:
        normalized_consumption = 1.0
    else:
        normalized_consumption = float((total_consumption - min_consumption) / (max_consumption - min_consumption))

    price_factor = min(float(total_price) / float(budget), 1.0)

    budget_weight = float(1 - consumption_weight)

    fitness = consumption_weight * normalized_consumption + budget_weight * price_factor

    return fitness * (1 + float(penalty))


def roulette_wheel_selection(population, fitnesses):
    max_fitness = sum(1 / f for f in fitnesses if f != float('inf'))
    if max_fitness == 0:
        return random.choice(population)

    pick = random.uniform(0, max_fitness)
    current = 0
    for individual, fitness_value in zip(population, fitnesses):
        if fitness_value == float('inf'):
            continue
        current += 1 / fitness_value
        if current > pick:
            return individual
    return random.choice(population)


def tournament_selection(population, fitnesses, tournament_size=3):
    selected = []
    for _ in range(tournament_size):
        i = random.randint(0, len(population) - 1)
        selected.append((population[i], fitnesses[i]))
    selected.sort(key=lambda x: x[1])
    return selected[0][0]


def rank_selection(population, fitnesses):
    sorted_population = sorted(zip(population, fitnesses), key=lambda x: x[1])
    ranks = range(len(sorted_population), 0, -1)
    total_ranks = sum(ranks)
    pick = random.uniform(0, total_ranks)
    current = 0

    for individual, rank in zip(sorted_population, ranks):
        current += rank
        if current > pick:
            return individual[0]
    return sorted_population[-1][0]


def crossover(parent1, parent2):
    crossover_point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:crossover_point] + parent2[crossover_point:]
    child2 = parent2[:crossover_point] + parent1[crossover_point:]
    return child1, child2

def two_point_crossover(parent1, parent2):
    point1 = random.randint(1, len(parent1) - 2)
    point2 = random.randint(point1 + 1, len(parent1) - 1)
    child1 = parent1[:point1] + parent2[point1:point2] + parent1[point2:]
    child2 = parent2[:point1] + parent1[point1:point2] + parent2[point2:]
    return child1, child2


def mutate(individual, devices, mutation_rate):
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            category_devices = [d for d in devices if d.category == individual[i].category]
            individual[i] = random.choice(category_devices)
    return individual


def genetic_algorithm_wheel_single_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                            mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = roulette_wheel_selection(population, fitnesses)
            parent2 = roulette_wheel_selection(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses

def genetic_algorithm_wheel_double_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                                 mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight,devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = roulette_wheel_selection(population, fitnesses)
            parent2 = roulette_wheel_selection(population, fitnesses)
            child1, child2 = two_point_crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses


def genetic_algorithm_tournament_single_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                                 mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = tournament_selection(population, fitnesses)
            parent2 = tournament_selection(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses


def genetic_algorithm_tournament_double_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                                 mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight,devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = tournament_selection(population, fitnesses)
            parent2 = tournament_selection(population, fitnesses)
            child1, child2 = two_point_crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses

def genetic_algorithm_rank_single_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                           mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight,devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = rank_selection(population, fitnesses)
            parent2 = rank_selection(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses

def genetic_algorithm_rank_double_crossover(devices, categories, budget, consumption_weight, population_size, generations,
                           mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight,devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = rank_selection(population, fitnesses)
            parent2 = rank_selection(population, fitnesses)
            child1, child2 = two_point_crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)

        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses

def genetic_algorithm_rank_elitism(devices, categories, budget, consumption_weight, population_size, generations,
                           mutation_rate, elitism_rate=0.1, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []
    global_min = 1
    num_elites = int(population_size * elitism_rate)

    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        elites = [ind for ind, _ in combined_population[:num_elites]]

        new_population = elites[:]

        while len(new_population) < population_size:
            parent1 = rank_selection(population, fitnesses)
            parent2 = rank_selection(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            if len(new_population) < population_size:
                new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        if global_min > best_fitness:
            global_min = best_fitness

        global_fitnesses.append(global_min)
        best_fitness_over_time.append(best_fitness)

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions], best_fitness_over_time, global_fitnesses


def genetic_algorithm_search(devices, categories, budget, consumption_weight, population_size, generations,
                                 mutation_rate, top_solutions=5):
    population = initialize_population(devices, categories, population_size)
    best_solutions = []


    for generation in range(generations):
        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = tournament_selection(population, fitnesses)
            parent2 = tournament_selection(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1, devices, mutation_rate))
            new_population.append(mutate(child2, devices, mutation_rate))

        population = new_population

        fitnesses = [fitness(ind, budget, consumption_weight, devices) for ind in population]
        combined_population = list(zip(population, fitnesses))
        combined_population.sort(key=lambda x: x[1])

        best_solution, best_fitness = combined_population[0]

        for solution, _ in combined_population:
            if solution not in best_solutions:
                best_solutions.append(solution)
                if len(best_solutions) == top_solutions:
                    break

    return best_solutions[:top_solutions]


@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    types = data.get('types', [])
    budget = data.get('budget', 0)
    dimensions = data.get('dimensions', {})
    consumption_weight = 0.2
    population_size = 100
    mutation_rate = 0.2
    generations = 150

    devices = get_devices_from_database()


    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    best_solutions = genetic_algorithm_search(filtered_devices, types, budget, consumption_weight, population_size,
                                              generations, mutation_rate)

    serialized_solutions = [
        [
            {
                'id': device.id,
                'consumption': device.consumption,
                'price': device.price,
                'category': device.category,
                'name': device.name,
                'url': device.url,
                'imageUrl': device.imageUrl,
            }
            for device in solution
        ]
        for solution in best_solutions
    ]

    return jsonify({"processed_types": serialized_solutions})

@app.route('/search-res', methods=['POST'])
def searchResearch():
    data = request.get_json()
    types = data.get('types', [])
    budget = data.get('budget', 0)
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])

    devices = get_devices_from_database()


    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    best_solutions = genetic_algorithm_search(filtered_devices, types, budget, consumption_weight, population_size,
                                              generations, mutation_rate)

    serialized_solutions = [
        [
            {
                'id': device.id,
                'consumption': device.consumption,
                'price': device.price,
                'category': device.category,
                'name': device.name,
                'url': device.url,
                'imageUrl': device.imageUrl,
            }
            for device in solution
        ]
        for solution in best_solutions
    ]

    return jsonify({"processed_types": serialized_solutions})

@app.route('/compare_algorithms', methods=['POST'])
def compare_algorithms():
    devices = get_devices_from_database()
    data = request.get_json()
    types = data['types']
    budget = float(data['budget'])
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])

    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    _,_, wheel_fitness = genetic_algorithm_wheel_single_crossover(filtered_devices, types, budget, consumption_weight, population_size,
                                               generations, mutation_rate)
    _,_, tournament_fitness = genetic_algorithm_tournament_single_crossover(filtered_devices, types, budget, consumption_weight,
                                                         population_size, generations, mutation_rate)
    _,_, rank_fitness = genetic_algorithm_rank_single_crossover(filtered_devices, types, budget, consumption_weight,
                                                                    population_size, generations, mutation_rate)

    return jsonify({
        'wheel_selection': wheel_fitness,
        'tournament_selection': tournament_fitness,
        'rank_selection': rank_fitness
    })

@app.route('/compare_crossover', methods=['POST'])
def compare_crossover():
    devices = get_devices_from_database()
    data = request.get_json()
    types = data['types']
    budget = float(data['budget'])
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])

    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    _,_, tournament_fitness_double = genetic_algorithm_tournament_double_crossover(filtered_devices, types, budget, consumption_weight, population_size,
                                               generations, mutation_rate)
    _,_, tournament_fitness = genetic_algorithm_tournament_single_crossover(filtered_devices, types, budget, consumption_weight,
                                                         population_size, generations, mutation_rate)

    return jsonify({
        'tournament_double': tournament_fitness_double,
        'tournament_selection': tournament_fitness
    })

@app.route('/compare_iteration_sel', methods=['POST'])
def compare_iteration_sel():
    devices = get_devices_from_database()
    data = request.get_json()
    types = data['types']
    budget = float(data['budget'])
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])


    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    _,wheel_fitness,_ = genetic_algorithm_wheel(filtered_devices, types, budget, consumption_weight, population_size,
                                               generations, mutation_rate)
    _,tournament_fitness,_ = genetic_algorithm_tournament(filtered_devices, types, budget, consumption_weight,
                                                         population_size, generations, mutation_rate)
    _,rank_fitness,_ = genetic_algorithm_rank(filtered_devices, types, budget, consumption_weight,
                                                                    population_size, generations, mutation_rate)

    return jsonify({
        'wheel_selection': wheel_fitness,
        'tournament_selection': tournament_fitness,
        'rank_selection': rank_fitness
    })

@app.route('/run-genetic-global', methods=['POST'])
def run_genetic_global():
    devices = get_devices_from_database()
    data = request.get_json()
    types = data['types']
    budget = float(data['budget'])
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])
    selection_type = data.get('selection_type')
    crossover_type = data.get('crossover_type')

    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    best_solutions = []
    best_fitness_over_time = []
    global_fitnesses = []

    if selection_type == "rank" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_rank_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    elif selection_type == "rank" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_rank_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    elif selection_type == "tournament" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_tournament_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    elif selection_type == "tournament" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_tournament_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    elif selection_type == "wheel" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_wheel_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    elif selection_type == "wheel" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_wheel_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )
    else:
        return jsonify({"error": "Unsupported selection_type or crossover_type combination"}), 400

    serialized_solutions = [
        [
            {
                'id': device.id,
                'consumption': device.consumption,
                'price': device.price,
                'category': device.category,
                'name': device.name,
                'url': device.url,
                'imageUrl': device.imageUrl,
            }
            for device in solution
        ]
        for solution in best_solutions
    ]



    return jsonify({"global_fitnesses": global_fitnesses,
                    "best_solutions": serialized_solutions
                    })

@app.route('/run-genetic-iteration', methods=['POST'])
def run_genetic_iteration():
    devices = get_devices_from_database()
    data = request.get_json()
    types = data['types']
    budget = float(data['budget'])
    dimensions = data.get('dimensions', {})
    consumption_weight = float(data['consumptionWeight'])
    population_size = int(data['populationSize'])
    generations = int(data['numGenerations'])
    mutation_rate = float(data['mutationRate'])
    selection_type = data.get('selection_type')
    crossover_type = data.get('crossover_type')

    filtered_devices = []
    for device in devices:
        device_type = device.category
        if device_type in dimensions:
            dim = dimensions[device_type]
            if 'width' in dim and device.width > float(dim['width']):
                continue
            if 'height' in dim and device.height > float(dim['height']):
                continue
            if 'length' in dim and device.length > float(dim['length']):
                continue
        filtered_devices.append(device)

    if selection_type == "rank" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_rank_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    if selection_type == "rank" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_rank_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    if selection_type == "tournament" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_tournament_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    if selection_type == "tournament" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_tournament_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    if selection_type == "wheel" and crossover_type == "single":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_wheel_single_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    if selection_type == "wheel" and crossover_type == "double":
        best_solutions, best_fitness_over_time, global_fitnesses = genetic_algorithm_wheel_double_crossover(
            filtered_devices, types, budget, consumption_weight, population_size, generations, mutation_rate
        )

    serialized_solutions = [
        [
            {
                'id': device.id,
                'consumption': device.consumption,
                'price': device.price,
                'category': device.category,
                'name': device.name,
                'url': device.url,
                'imageUrl': device.imageUrl,
            }
            for device in solution
        ]
        for solution in best_solutions
    ]

    return jsonify({"iteration_fitnesses": best_fitness_over_time,
                    "best_solutions": serialized_solutions
                    })


if __name__ == "__main__":
    app.run(debug=True)