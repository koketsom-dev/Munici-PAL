<?php
class SpatialUtils {
    
    // Convert WKT to PostGIS geometry
    public static function wktToGeometry($wkt, $srid = SRID) {
        return "ST_GeomFromText('$wkt', $srid)";
    }

    // Convert GeoJSON to PostGIS geometry
    public static function geojsonToGeometry($geojson, $srid = SRID) {
        $geojson_escaped = str_replace("'", "''", $geojson);
        return "ST_GeomFromGeoJSON('$geojson_escaped')";
    }

    // Create point from latitude and longitude
    public static function createPoint($lat, $lng, $srid = SRID) {
        return "ST_SetSRID(ST_MakePoint($lng, $lat), $srid)";
    }

    // Create geography point (for meter-based calculations)
    public static function createGeographyPoint($lat, $lng, $srid = SRID) {
        return self::createPoint($lat, $lng, $srid) . "::geography";
    }

    // Calculate distance between two points in meters
    public static function calculateDistance($point1, $point2) {
        return "ST_Distance($point1::geography, $point2::geography)";
    }

    // Find points within radius (in meters)
    public static function withinRadius($point_column, $center_lat, $center_lng, $radius_meters) {
        $center_point = self::createGeographyPoint($center_lat, $center_lng);
        return "ST_DWithin($point_column::geography, $center_point, $radius_meters)";
    }

    // Check if point is within polygon
    public static function pointInPolygon($point, $polygon) {
        return "ST_Within($point, $polygon)";
    }

    // Buffer a geometry by distance (in meters)
    public static function createBuffer($geometry, $distance_meters) {
        return "ST_Buffer($geometry::geography, $distance_meters)::geometry";
    }

    // Convert geometry to GeoJSON
    public static function toGeoJSON($geometry) {
        return "ST_AsGeoJSON($geometry)";
    }

    // Convert geometry to WKT
    public static function toWKT($geometry) {
        return "ST_AsText($geometry)";
    }

    // Get centroid of geometry
    public static function getCentroid($geometry) {
        return "ST_Centroid($geometry)";
    }

    // Get area in square meters
    public static function getArea($geometry) {
        return "ST_Area($geometry::geography)";
    }

    // Format spatial data for JSON response
    public static function formatSpatialData($data) {
        if (isset($data['geojson'])) {
            $data['geometry'] = json_decode($data['geojson'], true);
            unset($data['geojson']);
        }
        
        // Extract coordinates if they exist as separate columns
        if (isset($data['longitude']) && isset($data['latitude'])) {
            $data['coordinates'] = [
                'lng' => (float) $data['longitude'],
                'lat' => (float) $data['latitude']
            ];
        }
        
        return $data;
    }

    // Validate coordinates
    public static function isValidCoordinates($lat, $lng) {
        return ($lat >= -90 && $lat <= 90) && ($lng >= -180 && $lng <= 180);
    }

    // Validate GeoJSON structure
    public static function isValidGeoJSON($geojson) {
        if (!is_string($geojson)) return false;
        
        $decoded = json_decode($geojson, true);
        if (json_last_error() !== JSON_ERROR_NONE) return false;
        
        return isset($decoded['type']) && isset($decoded['coordinates']);
    }
}
?>