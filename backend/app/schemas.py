from pydantic import BaseModel, Field, model_validator


SUPPORTED_PRODUCTS = {
    "Uber": {"UberX", "UberXL", "Black", "Black SUV", "UberPool", "WAV"},
    "Lyft": {"Lyft", "Lyft XL", "Lux", "Lux Black", "Lux Black XL", "Shared"},
}
SUPPORTED_LOCATIONS = {
    "Back Bay", "Beacon Hill", "Boston University", "Fenway",
    "Financial District", "Haymarket Square", "North End", "North Station",
    "Northeastern University", "South Station", "Theatre District", "West End",
}
SUPPORTED_WEATHER = {
    "Clear", "Partly Cloudy", "Mostly Cloudy", "Overcast", "Light Rain",
    "Rain", "Foggy", "Drizzle", "Possible Drizzle",
}


class RidePredictionRequest(BaseModel):
    cab_type: str = Field(
        ...,
        examples=["Uber"],
        description="Cab provider platform, e.g. Uber or Lyft"
    )
    name: str = Field(
        ...,
        examples=["UberX"],
        description="Vehicle product tier, e.g. UberX, UberXL, Black, Lux, Shared"
    )
    distance: float = Field(
        ...,
        gt=0.0,
        le=5.4,
        examples=[3.5],
        description="Trip route distance in miles (must be > 0)"
    )
    surge_multiplier: float = Field(
        ...,
        ge=1.0,
        le=3.0,
        examples=[1.0],
        description="Surge pricing multiplier (must be >= 1.0)"
    )
    source: str = Field(
        ...,
        examples=["Back Bay"],
        description="Pickup Boston location zone"
    )
    destination: str = Field(
        ...,
        examples=["Fenway"],
        description="Drop-off Boston location zone"
    )
    hour: int = Field(
        ...,
        ge=0,
        le=23,
        examples=[18],
        description="Hour of trip start in 24-hour format (0 to 23)"
    )
    day: int = Field(
        ...,
        ge=1,
        le=30,
        examples=[15],
        description="Day of the month supported by the trained model (1 to 30)"
    )
    month: int = Field(
        ...,
        ge=11,
        le=12,
        examples=[11],
        description="Month supported by the trained model (11 to 12)"
    )
    temperature: float = Field(
        ...,
        ge=18.91,
        le=57.22,
        examples=[40.0],
        description="Ambient temperature in Fahrenheit (18.91 to 57.22)"
    )
    short_summary: str = Field(
        ...,
        examples=["Clear"],
        description="Weather condition summary (Clear, Overcast, Rain, etc.)"
    )
    precipIntensity: float = Field(
        ...,
        ge=0.0,
        le=0.1447,
        examples=[0.0],
        description="Precipitation intensity measurement (must be >= 0.0)"
    )

    @model_validator(mode="after")
    def validate_source_destination(self):
        if self.source.strip().lower() == self.destination.strip().lower():
            raise ValueError("Source and Destination locations cannot be the same.")
        return self

    @model_validator(mode="after")
    def validate_model_categories(self):
        if self.cab_type not in SUPPORTED_PRODUCTS:
            raise ValueError("cab_type must be Uber or Lyft.")
        if self.name not in SUPPORTED_PRODUCTS[self.cab_type]:
            raise ValueError(f"Product '{self.name}' is not supported for {self.cab_type}.")
        if self.source not in SUPPORTED_LOCATIONS:
            raise ValueError(f"Unsupported source location: {self.source}.")
        if self.destination not in SUPPORTED_LOCATIONS:
            raise ValueError(f"Unsupported destination location: {self.destination}.")
        if self.short_summary not in SUPPORTED_WEATHER:
            raise ValueError(f"Unsupported weather summary: {self.short_summary}.")
        return self


class RidePredictionResponse(BaseModel):
    predicted_price: float = Field(
        ...,
        description="Estimated continuous ride fare in USD"
    )
    cab_type: str
    name: str
    distance: float
    surge_multiplier: float
    source: str
    destination: str
    status: str = "success"
    message: str = "Cab fare predicted successfully"


class HealthCheckResponse(BaseModel):
    message: str
