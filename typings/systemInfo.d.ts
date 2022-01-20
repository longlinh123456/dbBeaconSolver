export interface SystemInfo {
	position: {
		X: number
		Y: number
		Z: number
	},
	identifier: string
	spectralClass: string
}
export type SpectralClass = "A" | "B" | "F" | "G" | "K" | "M" | "N"