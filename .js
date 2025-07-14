import { create_rectangle, create_sprite, create_text, query_position, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio } from "arcade_2d";
// enable_debug(); // Uncomment this to see debug info

// Constants
let snake_length = 4;
const food_growth = 4;
set_fps(10);

const snake = [];
const size = 600;
const unit = 30;
const grid = size / unit;
const start_length = snake_length;

// Create Sprite Gameobjects
update_scale(create_sprite("https://labs.phaser.io/assets/games/germs/background.png"), [4, 4]); // Background
const food = create_sprite("https://labs.phaser.io/assets/sprites/tomato.png");
let eaten = true;

for (let i = 0; i < 1000; i = i + 1) {
   snake[i] = update_color(update_position(create_rectangle(unit, unit), [-unit / 2, -unit / 2]),
       [127 + 128 * math_sin(i / 20), 127 + 128 * math_sin(i / 50), 127 + 128 * math_sin(i / 30), 255]); // Store offscreen
}
const snake_head = update_color(update_position(create_rectangle(unit * 0.9, unit * 0.9), [-unit / 2, -unit / 2]), [0, 0, 0 ,0]); // Head

let move_dir = [unit, 0];

// Other functions
const add_vec = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
const bound_vec = v => [(v[0] + size) % size, (v[1] + size) % size];
function input() {
   if (input_key_down("w") && move_dir[1] === 0) {
       move_dir = [0, -unit];
       play_audio(move);
   } else if (input_key_down("a") && move_dir[0] === 0) {
       move_dir = [-unit, 0];
       play_audio(move);
   } else if (input_key_down("s") && move_dir[1] === 0) {
       move_dir = [0, unit];
       play_audio(move);
   } else if (input_key_down("d") && move_dir[0] === 0) {
       move_dir = [unit, 0];
       play_audio(move);
   }
}
let alive = true;

// Create Text Gameobjects
const score = update_position(create_text("Score: "), [size - 60, 20]);
const game_text = update_color(update_scale(update_position(create_text(""), [size / 2, size / 2]), [2, 2]), [0, 0, 0, 255]);

// Audio
const eat = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/key.wav", 1);
const lose = create_audio("https://labs.phaser.io/assets/audio/stacker/gamelost.m4a", 1);
const move = create_audio("https://raw.githubusercontent.com/Loseheart58/Game/main/马里奥跳跃的声音_爱给网_aigei_com.mp3", 1);
const bg_audio = play_audio(loop_audio(create_audio("https://labs.phaser.io/assets/audio/tech/bass.mp3", 0.5)));

// Create Update loop
update_loop(game_state => {
   update_text(score, "Score: " + stringify(snake_length - start_length));
   if (!alive) {
       update_text(game_text, "Game Over!");
       return undefined;
   }

   // Move snake
   for (let i = snake_length - 1; i > 0; i = i - 1) {
       update_position(snake[i], query_position(snake[i - 1]));
   }
   update_position(snake[0], query_position(snake_head)); // Update head
   update_position(snake_head, bound_vec(add_vec(query_position(snake_head), move_dir))); // Update head
   debug_log(query_position(snake[0])); // Head

   input();

   // Add food
   if (eaten) {
       update_position(food, [math_floor(math_random() * grid) * unit + unit / 2, math_floor(math_random() * grid) * unit + unit / 2]);
       eaten = false;
   }

   // Eat food
   if (get_loop_count() > 1 && gameobjects_overlap(snake_head, food)) {
       eaten = true;
       snake_length = snake_length + food_growth;
       play_audio(eat);
   }
   debug_log(snake_length); // Score

   // Check collision
   if (get_loop_count() > start_length) {
       for (let i = 0; i < snake_length; i = i + 1) {
           if (gameobjects_overlap(snake_head, snake[i])) {
               alive = false;
               play_audio(lose);
               stop_audio(bg_audio);
           }
       }
   }
});
build_game();