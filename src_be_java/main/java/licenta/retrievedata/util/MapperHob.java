package licenta.retrievedata.util;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MapperHob {

    public Device convertToHob(RetrievedData retrievedData){
        Device newDevice = new Device();
        newDevice.setName(retrievedData.getTitle());
        newDevice.setCategory(takeCategory(retrievedData.getDescription()));
        newDevice.setPrice(BigDecimal.valueOf(retrievedData.getPrice()));
        newDevice.setUrl(retrievedData.getUrl());
        newDevice.setImageUrl(retrievedData.getImageUrl());
        newDevice.setConsumption(extractEnergyConsumption(retrievedData.getDescription()));
        newDevice.setConsumptionClass(extractConsumptionClass(retrievedData.getTitle()));
        newDevice.setHeight(takeHeight(retrievedData.getDescription()));
        newDevice.setWidth(takeWidth(retrievedData.getDescription()));
        newDevice.setLength(takeLength(retrievedData.getDescription()));
        return newDevice;

    }

    private String extractConsumptionClass(String input){

        String patternString = "Clasa eficienta energetica\\s+([^\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(1).trim();
        } else {
            return "invalid clasa";
        }

    }

    private double extractEnergyConsumption (String input){
        String patternString = "Putere \\(W\\)\\s*(\\d+\\.?\\d*)";

        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1))/1000;
        }

        return 8.0;
    }

    private String takeCategory(String input){

        String patternString = "Tip plita\\s*(\\S.+)";

        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return "Plita Incorporabila " + matcher.group(1).trim();
        }

        return "invalid category";

    }

    private Double takeHeight(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(3));
        } else {
            return 0.0;
        }

    }

    private Double takeWidth(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(2));
        } else {
            return 0.0;
        }

    }

    private Double takeLength(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        } else {
            return 0.0;
        }

    }
}
