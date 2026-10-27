# MyUI 2

A Roblox Luau UI library with:

- a blue header band with tabs;
- pill filters and three columns of cards;
- a light and a dark theme;
- [Lucide](https://lucide.dev/) icons;
- **Koharu**, a chibi anime girl who peeks over the panel with her fists resting on its edge. She blinks and follows your cursor, and when you click her she blushes and talks.

```lua
local Library = loadstring(game:HttpGet("https://raw.githubusercontent.com/dreams7906/MyUI2/main/MyUI2.lua"))()
```

See [`Example.lua`](Example.lua) for a short tour that uses every element: a **Main** tab with Basics / Inputs / Pickers pills and a **Mascot** tab to play with her moods and emotes.

If you also run [MyUI](https://github.com/dreams7906/MyUI) (the original look), the two replace each other, so use one per game.

## The look

- **Header band:** the big title, a "by NAME · DEV v1.0" line, and tabs with a sliding "folder tab" highlight that merges into the body.
- **Header buttons:** a moon/sun button that switches dark and light, a key pill showing the menu key (click it to rebind), and a close button.
- **Pill row:** sub-tabs as pills with a green active state. Pills that don't fit collapse into a **+N** pill that opens a menu.
- **Search and stats:** a search button that expands into a box, and live monospace stats: `Server 1/20   Session 00:01:22   Char Ready`.
- **Cards:** three columns in one scrolling page. Each card has a colored icon tile, a title, a toggle count (blue while one is on) and a collapse chevron.
- **Rows:** labels on the left with switches, inputs and dropdowns on the right. Status lines appear as monospace "• Example Toggle: Off" rows.
- **Window:** resizable from the bottom-right grip (double-click the grip to reset the size), draggable by the header. It remembers its position, size and last tab.
- **Loading screen:** a loading card with Koharu peeking over its top edge.

## The mascot: Koharu

Koharu is one of [Live2D](https://www.live2d.com/)'s official sample characters. Her Live2D model was posed with her arms up, so her fists rest on the edge she peeks over, and rendered into a sprite sheet ([`assets/koharu.png`](assets/koharu.png), 25 frames). The library swaps the frames and animates them with tweens.

What she does:

- **Idle:** she breathes and sways a little, blinks every few seconds, and turns her head toward your cursor (left, centre, right, or looking down).
- **Click her:** she hops, blushes or smiles, hearts float up, and she says a line in the speech bubble. Her mouth moves while the line types out.
- **Hold the mouse on her:** you pat her head. She closes her eyes happily, squishes with each pat, and more hearts float up.
- **Too many pokes:** first she gets flustered, teary-eyed, and shakes her head (with a sweat drop). After six pokes she pouts and ducks behind the panel, then peeks back up a few seconds later.
- **Leave her alone:** after about a minute without mouse movement she gets sleepy and "zzz" floats up. Moving the mouse wakes her with a start.
- **Other moments:** she greets you with sparkles (and sparkly eyes) when the menu opens. Now and then she says an idle line or reacts when you switch a toggle on.

Everything is adjustable in **Settings → Interface → Mascot**: show/hide her, speech bubbles, follow cursor, and reactions.

```lua
Window:Say("Hello!", 3, "Smile")    -- text, seconds to hold (optional), mood (optional)

local Koharu = Window.Mascot
Koharu:SetMood("Blush")              -- Idle, Smile, Happy, Blush, Pat, Flustered, Surprised, Pout, Sleepy, Wink
Koharu:Emote("Hearts")               -- Hearts, Sparkles, Shock, Sweat, Sleep
Koharu:Hop()
Koharu:Squish()
Koharu:Shake()
Koharu:Hide()                        -- duck behind the panel
Koharu:Peek()                        -- come back up
Window:SetMascotVisible(false)
```

### Options

```lua
Library:CreateWindow({
	Mascot = {
		Size = 138,                  -- frame size in pixels (her head and fists)
		Lines = {
			Greeting = { "Welcome back, captain!" },
			Click = { "Hey!", "That tickles!" },
			Pat = { "...fine, you can stay." },
			Idle = { "Still grinding?" },
			-- also: Spam, Hide, Return, Wake, React (React uses %s for the toggle name)
		},
		-- Your own artwork instead of the sheet (one image per mood, Idle required):
		-- Images = { Idle = "rbxassetid://...", Blush = "rbxassetid://...", Happy = "rbxassetid://..." },
	},
})
```

Pass `Mascot = false` to turn her off completely.

## Icons

Icons are [Lucide](https://lucide.dev/), plus a few from [Tabler](https://tabler.io/icons), taken from [Iconify](https://icon-sets.iconify.design/). About 390 of them are packed into [`assets/icons.png`](assets/icons.png), with names in [`assets/icons.json`](assets/icons.json). Use any packed name wherever an icon is accepted:

```lua
Window:AddTab({ Title = "Combat", Icon = "swords" })
Tab:AddSection({ Title = "Fishing", Icon = "fish", Color = Color3.fromRGB(38, 172, 196) })
```

A few examples: `house`, `settings`, `user`, `users`, `swords`, `crosshair`, `target`, `eye`, `zap`, `flame`, `star`, `crown`, `gem`, `coins`, `gift`, `package`, `map`, `compass`, `rocket`, `car`, `bike`, `fish`, `ghost`, `skull`, `heart`, `bell`, `palette`, `sliders-horizontal`, `wand-sparkles`, `bot`. The full list is in [`tools/icons/icons.txt`](tools/icons/icons.txt).

Short names work too (`home`, `gear`, `grid`, `sliders`, `alert`, `chevron`...). You can also pass an asset id (`"rbxassetid://123"`) or a short text glyph.

**Adding icons.** Add Lucide names, or `set:name` from any Iconify set (for example `mdi:sword` or `game-icons:fishing-pole`), to `tools/icons/icons.txt`. Then rebuild the sheet (see [`tools/README.md`](tools/README.md)):

```bash
npm i playwright @iconify-json/lucide @iconify-json/tabler   # plus @iconify-json/<set> for other sets
node tools/icons/build.js
```

## How the images load

- **Download and cache:** on the first run the library downloads the icon sheet (~200 KB) and Koharu's sheet (~260 KB) from this repo's `assets` folder into `MyUI2/assets` in your executor's workspace, then shows them with `getcustomasset`. Later runs use the cached copies, and only the small `icons.json` is checked for updates.
- **Fallback:** if your executor has no `getcustomasset` or the download fails, icons fall back to a built-in drawn set and Koharu stays hidden. Everything else works the same.
- **Uploaded copies:** you can upload the two PNGs to Roblox yourself and point the library at them. Set this before `CreateWindow`:

```lua
Library.Assets = { Icons = "rbxassetid://...", Mascot = "rbxassetid://..." }
-- Library.Assets = false            -- never download anything
-- Library.AssetUrl = "https://raw.githubusercontent.com/<you>/<repo>/<branch>/assets/"
```

## Window

```lua
local Window = Library:CreateWindow({
	Title = "Example",             -- big title; leave it out to show the game's real name
	Author = "XX",                 -- shown as "by XX"
	Badge = "DEV",                 -- the little tag (false hides it)
	Version = "v1.0",
	Icon = "sparkles",             -- icon before "by XX"
	Theme = "Dark",                -- "Dark" or "Light" (saved choice wins)
	ToggleKey = Enum.KeyCode.RightShift,
	ConfigFolder = "XX/Example",
	Columns = 3,                   -- cards per row (1-4)
	Size = UDim2.fromOffset(900, 560),
	MinSize = Vector2.new(760, 460),
	LoadingScreen = true,
	LoadingTime = 3.5,
	AutoSave = false,
	AutoLoad = true,
	SettingsTab = true,
	Mascot = { ... },              -- see above, or false
})

Window:SetTitle("My Hub")
Window:SetAuthor("XX")
Window:SetVersion("v2.0")
Window:SetBadge("BETA")
Window:SetScale(1.1)
Window:Toggle()
```

## Tabs, pills and cards

```lua
local Main = Window:AddTab({ Title = "Main", Icon = "house" })
local Basics = Main:AddSubTab("Basics")             -- a pill

local Card = Basics:AddSection({
	Title = "Toggles",
	Icon = "toggle-right",
	Color = Color3.fromRGB(46, 196, 110),           -- icon tile color (default: accent)
	Side = 1,                                       -- column 1-3, or "Left" / "Middle" / "Right"
})
```

- A card created from a pill shows under that pill and under **All**. A card created straight from the tab shows under every pill.
- Pass `ShowAll = false` to `AddTab` to drop the **All** pill.
- Leaving `Side` out puts the card in the shortest column.

## Elements

Every element takes either `(flag, options)` or `(options)` with `options.Flag`. If you leave the flag out, one is generated from the tab, section and title, so the element is still saved in configs. Pass `Save = false` to keep an element out of configs.

### Toggle

```lua
local Toggle = Card:AddToggle("AutoFarm", {
	Title = "Auto Farm",
	Default = false,
	Description = "Optional grey text under the title",
	Tooltip = "Shown on hover",
	Callback = function(value) end,
})
Toggle:AddKeybind("AutoFarmKey", { Default = Enum.KeyCode.F, Mode = "Toggle" })  -- presses flip the toggle
Toggle:AddColorPicker("AutoFarmColor", { Default = Color3.new(1, 0, 0) })
```

### Button

```lua
Card:AddButton({ Title = "Teleport", Callback = function() end })
	:AddButton({ Title = "Reset", Confirm = true, Callback = function() end }) -- same row
```

`Confirm = true`, or a string, requires a second click within 2.5 s.

### Slider

```lua
Card:AddSlider("Speed", {
	Title = "Walk Speed", Min = 16, Max = 200, Default = 16,
	Increment = 1,            -- or Rounding = 2 (decimal places)
	Suffix = " studs",
	CallbackOnRelease = false, -- true = fire only when the drag ends
	Callback = function(value) end,
})
```

Click the value to type an exact number.

### Input

```lua
Card:AddInput("Limit", {
	Title = "Limit", Default = 800, Placeholder = "0-5000",
	Numeric = true, Min = 0, Max = 5000,  -- Value is a number when Numeric
	Finished = true,                      -- fire on focus lost instead of every keystroke
	MaxLength = 10, ClearTextOnFocus = false,
	Callback = function(value) end,
})
```

### Dropdown

```lua
local Mode = Card:AddDropdown("Mode", {
	Title = "Mode",
	Values = { "Auto", "Manual", "Off" },
	Default = "Auto",           -- or an index (1)
	Multi = false,              -- true = checkbox multi-select
	Searchable = true,          -- search box inside the list
	AllowNull = false,          -- let clicking the selected value clear it
	Placeholder = "None",
	Callback = function(value) end,
})
Card:AddDropdown("Target", { Title = "Player", SpecialType = "Player", ExcludeLocal = true })

Mode:SetValues({ "A", "B" })    -- alias :Refresh()
Mode:AddValue("C")
Mode:RemoveValue("A")
Mode:GetSelected()              -- array, in list order
```

For multi-select dropdowns, `Value` is a set such as `{ Apple = true, Pear = true }`. `SetValue` accepts either a set or an array. When the search box has focus, Enter picks the first match.

### Color picker

```lua
local Picker = Card:AddColorPicker("ESPColor", {
	Title = "ESP Color",
	Default = Color3.fromRGB(61, 124, 222),
	Transparency = 0,          -- include this to show the alpha bar
	Callback = function(color, transparency) end,
})
Picker:SetValue(Color3.new(1, 0, 0), 0.5)
Picker:SetRainbow(true)
```

### Keybind

```lua
local Dash = Card:AddKeybind("Dash", {
	Title = "Dash",
	Default = Enum.KeyCode.Q,  -- or "Q", "MouseButton2", "None"
	Mode = "Toggle",           -- "Toggle" | "Hold" | "Always"
	Callback = function(state) end,       -- state changes
	ChangedCallback = function(key) end,  -- key changes
})
Dash:OnClick(function() end)  -- every press, any mode
Dash:GetState()
Dash:SetValue("E", "Hold")
```

To rebind, click the key chip and press a key: Backspace clears it and Esc cancels. Right-click the chip to change the mode. Keybinds ignore presses while a text box has focus.

### Label, paragraph, divider

```lua
local Status = Card:AddLabel("Auto Farm: Disabled")   -- monospace status row with a bullet
Status:SetText("Auto Farm: <b>Enabled</b>")             -- RichText supported
Card:AddLabel("Plain text", { Style = "Plain" })
local Tips = Card:AddParagraph({ Title = "Tips", Content = "..." })
Tips:SetContent("...")
Card:AddDivider("optional label")
```

### Shared element API

| Member | Description |
| --- | --- |
| `.Value` | Current value |
| `:SetValue(value)` | Sets the value and fires callbacks when it changes |
| `:OnChanged(fn)` | Extra change listener (chainable) |
| `:SetVisible(bool)` | Shows or hides the element |
| `:SetTitle(text)` | Renames the element (search follows the new title) |
| `:SetTooltip(text)` | Sets the hover tooltip |
| `:Reset()` | Restores the value it was created with (also on right-click) |
| `:Destroy()` | Removes the element and its flag |

`Library.Flags[flag]` holds each flag's plain value, and `Library.Options[flag]` holds the element object.

## Config system

Files live in your executor's workspace:

```
<ConfigFolder>/
  configs/<name>.json   saved configs
  autoload.txt          config loaded on startup
  settings.json         theme, scale, menu key, mascot options, window position...
MyUI2/assets/           cached icon and mascot sheets
```

The **Settings → Configs** page covers all of this. The same actions are available from code:

```lua
Library:SaveConfig("main")          -- fails if it exists...
Library:SaveConfig("main", true)    -- ...unless you overwrite
Library:LoadConfig("main")
Library:DeleteConfig("main")
Library:GetConfigs()                -- { "main", ... }
Library:SetAutoload("main")         -- nil clears it
Library:GetAutoload()
Library:LoadAutoloadConfig()        -- runs automatically unless AutoLoad = false
Library:SetAutoSave(true)
Library:ExportConfig()              -- JSON string
Library:ImportConfig(json)
```

- **Auto save** writes to the active config, which is the last one you saved or loaded. If there is none, it writes to `autosave`. It waits for one quiet second after the last change, so dragging a slider writes once.
- **Auto load** runs right after your script finishes. If a loaded config holds flags for elements you create later, those elements receive their values when they are created.
- Without executor file functions (for example in Studio), configs are kept in memory for the session.

## Theme and notifications

```lua
Library:SetTheme("Light")           -- "Dark" or "Light"; switching cross-fades every color
Library:ToggleTheme()
Library.Animations = false          -- instant state changes, lowest overhead
Library:SetKeybindListVisible(true)
Library:Notify({ Title = "Hi", Content = "Rich <b>text</b>", Type = "Success", Duration = 4 })
-- Type: "Info" | "Success" | "Warning" | "Error"; also Library:Notify("text", seconds)
```

## Lifetime

```lua
Library:OnUnload(function() end)
Library:Unload()  -- disconnects everything and destroys the GUI
```

Running the script again automatically unloads every earlier copy, so interfaces never stack or fight over the menu key.

## Credits

- **Koharu** © Live2D Inc., a Live2D Cubism 2 sample model (taken from the [`live2d-widget-model-koharu`](https://www.npmjs.com/package/live2d-widget-model-koharu) package). Live2D's sample models are provided under the [Live2D Free Material License](https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html); read its terms before using her in a commercial project.
- **Icons:** [Lucide](https://lucide.dev/) (ISC) and [Tabler Icons](https://tabler.io/icons) (MIT), via [Iconify](https://iconify.design/).
