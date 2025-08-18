import { GAME_VARIABLES } from "~/game/engine/engine";
import type { Inventory } from "~/game/inventory/class";
import { getRandomFloatInRange } from "~/game/shared/utils";
import { isEmptyObject } from "~/utils/object";
import { Item } from "../class";
import { ClothingArea, ClothingState, ItemTag } from "../enums";
import type { GenericItemDynamicData, ItemConstructorArgs } from "../types";
import type { AllClothingDurabilityPoints, ClothingDynamicData } from "./types";

class Clothing extends Item {
	// If this has to be "truly" private, then you'd have to scrap the getter / setters for regular methods while ensuring to `bind(this)` them in the constructor. Otherwise you may encounter an error related to `TypeError: Cannot write private member to an object whose class did not declare it`
	// NOTE - Don't use this directly. Just use the getter / setters
	private a: ClothingArea;

	constructor(data: ItemConstructorArgs<Clothing>) {
		super(data);
		this.usable = true;
		this.addTags(ItemTag.CLOTHING);
	}

	// SECTION - Clothing Item Methods
	override defaultCallback(
		data?: ClothingDynamicData,
		inventory = GAME_VARIABLES().player.inventory,
	) {
		// ANCHOR - The stored clothing data is what we use to determine if a clothing item is equipped and what damage state it currently is
		let storedClothingData = Clothing.sanitiseClothingData(data);
		const isEquipped = Clothing.isEquipped(data);

		// TODO - Only wear the clothing item if there's still free space on the body
		if (isEquipped) {
			// Un-equip the clothing
			storedClothingData.clothingState &= ~ClothingState.IN_USE;
		} else if (this.canClothBeEquipped(inventory)) {
			// Equip the clothing
			storedClothingData.clothingState |= ClothingState.IN_USE;

			// There's a 50% chance to lose a durability point when clothing is equipped
			if (getRandomFloatInRange(0, 1) > 0.5) {
				storedClothingData = Clothing.reduceDurabilityPoints(
					storedClothingData,
					1,
				);
			}
		}

		return storedClothingData;
	}

	doesClothCoverBodyPart(bodyPart: ClothingArea) {
		return this.bodyArea !== ClothingArea.NONE
			? bodyPart === (this.bodyArea & bodyPart)
			: false;
	}

	canClothBeEquipped(inventory: Inventory) {
		const allEquippedClothing = Clothing.getAllEquippedClothing(inventory);
		if (!allEquippedClothing) return true;

		const occupiedBodyAreasArray = allEquippedClothing.map((data) => {
			return data.staticData.bodyArea;
		});

		if (!occupiedBodyAreasArray) return true;

		let occupiedOuterBodyAreas = ClothingArea.NONE;
		let occupiedInnerBodyAreas = ClothingArea.NONE;

		occupiedBodyAreasArray.forEach((val) => {
			if (val & ClothingArea.INNER) occupiedInnerBodyAreas |= val;
			else occupiedOuterBodyAreas |= val;
		});

		// let result = false

		if (
			occupiedOuterBodyAreas & this.bodyArea &&
			occupiedInnerBodyAreas & this.bodyArea
		) {
			// There's not enough free space on either the inner / outer part of the body
			return false;
		}
		return true;
	}
	// !SECTION

	// SECTION - Clothing Item Static Methods

	// This will always make sure the `data` parameter always has a usable value
	protected static sanitiseClothingData(
		data: ClothingDynamicData | GenericItemDynamicData | undefined,
	) {
		if (!data) return { clothingState: ClothingState.DEFAULT };

		return !isEmptyObject(data) &&
			(data as ClothingDynamicData).clothingState !== undefined
			? (data as ClothingDynamicData)
			: { clothingState: ClothingState.DEFAULT };
	}

	// This `data` has to be supplied from the Item in the inventory that called it
	static getAverageDurabilityLevel(data: ClothingDynamicData) {
		const storedClothingData = Clothing.sanitiseClothingData(data);

		if (storedClothingData.clothingState) {
			let bitField = storedClothingData.clothingState;
			// Unset unneeded bits
			bitField &= ~ClothingState.IN_USE;

			if (bitField & ClothingState.DURABILITY_EXCELLENT) {
				return ClothingState.DURABILITY_EXCELLENT;
			} else if (bitField & ClothingState.DURABILITY_HIGH) {
				return ClothingState.DURABILITY_HIGH;
			} else if (bitField & ClothingState.DURABILITY_GOOD) {
				return ClothingState.DURABILITY_GOOD;
			} else if (bitField & ClothingState.DURABILITY_OKAY) {
				return ClothingState.DURABILITY_OKAY;
			} else if (bitField & ClothingState.DURABILITY_POOR) {
				return ClothingState.DURABILITY_POOR;
			} else {
				return ClothingState.DURABILITY_WORN_OUT;
			}
		}

		// No data so just default to being worn out
		return ClothingState.DURABILITY_WORN_OUT;
	}
	static setAverageDurabilityLevel(
		data: ClothingDynamicData,
		durabilityLvl:
			| ClothingState.DURABILITY_WORN_OUT
			| ClothingState.DURABILITY_POOR
			| ClothingState.DURABILITY_OKAY
			| ClothingState.DURABILITY_GOOD
			| ClothingState.DURABILITY_HIGH
			| ClothingState.DURABILITY_EXCELLENT,
	) {
		let storedClothingData = Clothing.sanitiseClothingData(data);

		// Clear the durability before resetting it.
		storedClothingData = Clothing.clearDurabilityPoints(storedClothingData);

		storedClothingData.clothingState |= durabilityLvl;

		return storedClothingData;
	}

	// Returns a member of the type `AllClothingDurabilityPoints`
	static getHighestDurabilityPoint(
		data: ClothingDynamicData,
	): AllClothingDurabilityPoints {
		const storedClothingData = Clothing.sanitiseClothingData(data);

		// This clears all non-necessary bits and then checks the amount of leading zeros (in a 32 bit representation). Subtracting that from 31 should give us the appropriate bit position
		return (
			1 <<
			(31 -
				Math.clz32(
					storedClothingData.clothingState &
						ClothingState.ALL_DURABILITY_POINTS,
				))
		);
	}

	static #getBitPos(durPoint: AllClothingDurabilityPoints) {
		return 31 - Math.clz32(durPoint);
	}

	static setDurabilityPoint(
		data: ClothingDynamicData,
		durabilityPoint: AllClothingDurabilityPoints,
	) {
		let storedClothingData = Clothing.sanitiseClothingData(data);

		const bitPosUpperBound = Clothing.#getBitPos(durabilityPoint);
		const bitPosLowerBound = Clothing.#getBitPos(
			ClothingState.LOWEST_DURABILITY_POINT,
		);

		// Clear all the durability bits
		storedClothingData = Clothing.clearDurabilityPoints(storedClothingData);

		// Set all the bits (inclusively) between the 2 boundaries
		for (let i = bitPosLowerBound; i <= bitPosUpperBound; i++) {
			storedClothingData.clothingState |= 1 << i;
		}

		return storedClothingData;
	}

	static clearDurabilityPoints(data: ClothingDynamicData) {
		const storedClothingData = Clothing.sanitiseClothingData(data);

		// Clear all the durability bits
		storedClothingData.clothingState &= ~ClothingState.ALL_DURABILITY_POINTS;

		return storedClothingData;
	}

	static reduceDurabilityPoints(
		data: ClothingDynamicData,
		numToReduceBy: number,
	) {
		let storedClothingData = Clothing.sanitiseClothingData(data);

		const clothingDurability =
			storedClothingData.clothingState & ClothingState.ALL_DURABILITY_POINTS;

		const bitPosUpperBound = Clothing.#getBitPos(clothingDurability);
		const bitPosLowerBound = Clothing.#getBitPos(
			ClothingState.LOWEST_DURABILITY_POINT,
		);
		const bitPosAfterReduction = bitPosUpperBound - numToReduceBy;

		// Clear the bits
		storedClothingData = Clothing.clearDurabilityPoints(storedClothingData);

		// Don't go beyond 0 durability
		if (bitPosAfterReduction < bitPosLowerBound) {
			return storedClothingData;
		}

		// Now set the bits to `bitPosAfterReduction`
		storedClothingData = Clothing.setDurabilityPoint(
			storedClothingData,
			1 << bitPosAfterReduction,
		);

		return storedClothingData;
	}

	static isEquipped(data: ClothingDynamicData | undefined) {
		const storedClothingData = Clothing.sanitiseClothingData(data);

		return (storedClothingData.clothingState &
			ClothingState.IN_USE) as unknown as boolean;
	}
	static getAllEquippedClothing(inventory: Inventory) {
		const allClothingInInventory = inventory.getAllItemsByItemTag(
			new Set([ItemTag.CLOTHING]),
		);
		const allEquippedClothingInInventory = allClothingInInventory.filter(
			(clothing) => {
				const storedClothingData = clothing.dynamicData as ClothingDynamicData;
				return Clothing.isEquipped(storedClothingData);
			},
		);

		const result = allEquippedClothingInInventory.map((clothing) => {
			return {
				staticData: clothing.staticData as Clothing,
				dynamicData: clothing.dynamicData as ClothingDynamicData,
			};
		});

		return result;
	}
	// !SECTION

	// SECTION - Clothing Item Getters
	get bodyArea() {
		return this.a !== undefined ? this.a : ClothingArea.NONE;
	}

	get isInnerWear() {
		return this.bodyArea & ClothingArea.INNER;
	}
	// !SECTION

	// SECTION - Clothing Item Setters
	set bodyArea(val: ClothingArea) {
		if (val !== ClothingArea.NONE) this.a = val;
	}
	// !SECTION
}

export { Clothing };
